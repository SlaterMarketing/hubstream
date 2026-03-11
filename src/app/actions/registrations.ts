"use server";

import { headers } from "next/headers";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { getPlanLimits } from "@/lib/plans";
import {
  getValidHubSpotAccessToken,
  createOrUpdateHubSpotContact,
  createHubSpotMeeting,
} from "@/lib/hubspot";
import { addAttendeeToCalendarEvent } from "@/lib/google-calendar";
import { sendConfirmationEmail } from "@/lib/email";

async function getGoogleTokens(userId: string) {
  const account = await db.account.findFirst({
    where: { userId, provider: "google" },
  });
  return account?.access_token && account?.refresh_token
    ? { accessToken: account.access_token, refreshToken: account.refresh_token }
    : null;
}

function generateCancelToken(): string {
  return randomBytes(32).toString("hex");
}

const STANDARD_KEYS = ["firstName", "lastName", "company", "jobTitle"];

export async function registerForEvent(
  eventId: string,
  data: {
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    jobTitle?: string;
    customFieldValues?: Record<string, string | boolean>;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    locale?: string;
    consent: boolean;
  }
) {
  const email = data.email?.trim().toLowerCase();
  if (!email) return { error: "Email is required" };
  if (!data.consent) return { error: "You must agree to receive communications about this event." };

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      organization: true,
    },
  });
  if (!event) return { error: "Event not found" };
  if (event.status !== "published") return { error: "This event is not open for registration." };

  const now = new Date();
  if (event.startsAt <= now) return { error: "This event has already started." };

  const org = event.organization;
  const limits = getPlanLimits((org.plan as "free" | "pro") ?? "free");

  const confirmedCount = await db.registration.count({
    where: { eventId, status: "confirmed" },
  });
  if (confirmedCount >= limits.maxAttendeesPerEvent) {
    return { error: "This event is full. Please try another event." };
  }

  const existing = await db.registration.findFirst({
    where: { eventId, email, status: "confirmed" },
  });
  if (existing) {
    return { error: "You are already registered for this event." };
  }

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headersList.get("x-real-ip") ?? null;

  const customValues = data.customFieldValues ?? {};
  const customOnly: Record<string, string | boolean> = {};
  for (const [k, v] of Object.entries(customValues)) {
    if (!STANDARD_KEYS.includes(k) && v !== undefined && v !== "") {
      customOnly[k] = v;
    }
  }

  const registration = await db.registration.create({
    data: {
      eventId,
      email,
      firstName: data.firstName?.trim() || null,
      lastName: data.lastName?.trim() || null,
      company: data.company?.trim() || null,
      jobTitle: data.jobTitle?.trim() || null,
      customFieldValues: Object.keys(customOnly).length ? customOnly : undefined,
      utmSource: data.utmSource?.trim() || null,
      utmMedium: data.utmMedium?.trim() || null,
      utmCampaign: data.utmCampaign?.trim() || null,
      locale: data.locale || null,
      cancelToken: generateCancelToken(),
      consentRecords: {
        create: {
          consentType: "event_communications",
          granted: true,
          ipAddress: ip,
        },
      },
    },
  });

  const orgId = event.organization.id;
  const accessToken = await getValidHubSpotAccessToken(orgId);
  const integrationSettings = accessToken
    ? await db.integrationSettings.findUnique({
        where: { orgId },
        select: { hubspotFieldMapping: true },
      })
    : null;
  if (accessToken) {
    try {
      const contactId = await createOrUpdateHubSpotContact(
        accessToken,
        {
        email,
        firstName: data.firstName?.trim() || undefined,
        lastName: data.lastName?.trim() || undefined,
        company: data.company?.trim() || undefined,
        jobTitle: data.jobTitle?.trim() || undefined,
        customProperties: Object.keys(customOnly).length ? customOnly : undefined,
      },
      (integrationSettings?.hubspotFieldMapping as Record<string, string> | null) ?? undefined
      );
      if (contactId) {
        await db.registration.update({
          where: { id: registration.id },
          data: { hubspotContactId: contactId },
        });
        const startTime = event.startsAt;
        const endTime = new Date(
          startTime.getTime() + event.durationMinutes * 60 * 1000
        );
        await createHubSpotMeeting(accessToken, contactId, {
          title: event.title,
          startTime,
          endTime,
          body: event.speakers ? `Speakers: ${event.speakers}` : undefined,
          location: event.meetLink ?? undefined,
        });
      }
    } catch {
      // HubSpot sync is best-effort; don't fail registration
    }
  }

  // Prefer Google Calendar invite (from organizer's Gmail) to save Resend API usage
  let sentViaGoogle = false;
  if (event.calendarEventId && event.createdById) {
    const tokens = await getGoogleTokens(event.createdById);
    if (tokens) {
      sentViaGoogle = await addAttendeeToCalendarEvent(
        tokens.accessToken,
        tokens.refreshToken,
        event.calendarEventId,
        email
      );
    }
  }

  // Fall back to Resend confirmation when Google Calendar isn't available
  if (!sentViaGoogle) {
    try {
      await sendConfirmationEmail({
        to: email,
        eventTitle: event.title,
        startsAt: event.startsAt,
        durationMinutes: event.durationMinutes,
        meetLink: event.meetLink,
        cancelToken: registration.cancelToken,
      });
    } catch {
      // Email is best-effort; don't fail registration
    }
  }

  return { success: true, registrationId: registration.id };
}

export async function cancelRegistration(cancelToken: string) {
  const registration = await db.registration.findUnique({
    where: { cancelToken },
    include: { event: true },
  });
  if (!registration) return { error: "Registration not found" };
  if (registration.status === "cancelled") return { error: "Registration is already cancelled." };

  await db.registration.update({
    where: { id: registration.id },
    data: { status: "cancelled" },
  });

  return { success: true };
}

export async function unsubscribeFromReminders(cancelToken: string) {
  const registration = await db.registration.findUnique({
    where: { cancelToken },
  });
  if (!registration) return { error: "Registration not found" };

  await db.registration.update({
    where: { id: registration.id },
    data: { unsubscribed: true },
  });

  return { success: true };
}
