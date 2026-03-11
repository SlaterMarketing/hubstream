"use server";

import { revalidatePath } from "next/cache";
import type { JSONContent as TiptapJSON } from "@tiptap/core";

function tiptapToPlainText(content: TiptapJSON | null | undefined): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  let text = "";
  if (content.content) {
    for (const node of content.content) {
      if (node.type === "text" && node.text) text += node.text;
      else if (node.content) text += tiptapToPlainText(node);
    }
  }
  return text;
}
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getPlanLimits } from "@/lib/plans";
import {
  createCalendarEventWithMeet,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/lib/google-calendar";
import {
  sendCancellationEmail,
  sendRescheduleEmail,
  sendRecordingAvailableEmail,
} from "@/lib/email";
import type { JSONContent } from "@tiptap/core";

async function getGoogleTokens(userId: string) {
  const account = await db.account.findFirst({
    where: { userId, provider: "google" },
  });
  return account
    ? {
        accessToken: account.access_token,
        refreshToken: account.refresh_token,
      }
    : null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type RegistrationField = {
  key: string;
  label: string;
  type: "text" | "select" | "checkbox";
  required?: boolean;
  options?: string[];
};

export async function createEvent(formData: {
  title: string;
  subtitle?: string;
  description?: JSONContent;
  startsAt: string;
  durationMinutes: number;
  timezone: string;
  speakers?: string;
  coverImageUrl?: string;
  media?: Array<{ type: "image" | "youtube"; url?: string; videoId?: string }>;
  registrationFields?: RegistrationField[];
  speakerIds?: string[];
}) {
  const session = await auth();
  const user = session?.user as { id?: string; orgId?: string | null };
  if (!user?.id || !user?.orgId) {
    return { error: "Unauthorized" };
  }

  const slug = slugify(formData.title);
  const existing = await db.event.findUnique({
    where: { orgId_slug: { orgId: user.orgId, slug } },
  });
  if (existing) {
    return { error: "An event with this title already exists. Try a different title." };
  }

  const startsAt = new Date(formData.startsAt);

  const event = await db.event.create({
    data: {
      orgId: user.orgId,
      createdById: user.id,
      title: formData.title,
      slug,
      subtitle: formData.subtitle?.trim() || null,
      description: formData.description ?? undefined,
      startsAt,
      durationMinutes: formData.durationMinutes ?? 60,
      timezone: formData.timezone || "UTC",
      speakers: formData.speakers?.trim() || null,
      coverImageUrl: formData.coverImageUrl?.trim() || null,
      media: formData.media ?? undefined,
      registrationFields: formData.registrationFields ?? undefined,
      status: "draft",
    },
  });

  if (formData.speakerIds?.length) {
    await db.eventSpeaker.createMany({
      data: formData.speakerIds.map((speakerId, i) => ({
        eventId: event.id,
        speakerId,
        sortOrder: i,
      })),
    });
  }

  revalidatePath("/dashboard");
  return { success: true, eventId: event.id };
}

export async function publishEvent(eventId: string) {
  const session = await auth();
  const user = session?.user as { id?: string; orgId?: string | null };
  if (!user?.id || !user?.orgId) {
    return { error: "Unauthorized" };
  }

  const event = await db.event.findFirst({
    where: { id: eventId, orgId: user.orgId },
  });
  if (!event) return { error: "Event not found" };
  if (event.status !== "draft") return { error: "Event is already published or cancelled" };

  const org = await db.organization.findUnique({
    where: { id: user.orgId },
  });
  if (!org) return { error: "Organization not found" };

  const limits = getPlanLimits(org.plan as "free" | "pro");
  if (limits.maxPublishedUpcoming < Infinity) {
    const upcomingCount = await db.event.count({
      where: {
        orgId: user.orgId,
        status: "published",
        startsAt: { gt: new Date() },
      },
    });
    if (upcomingCount >= limits.maxPublishedUpcoming) {
      return {
        error: "Free plan allows only 1 published upcoming webinar. Upgrade to Pro for unlimited.",
      };
    }
  }

  const tokens = await getGoogleTokens(user.id);
  if (!tokens?.accessToken || !tokens?.refreshToken) {
    return { error: "Google Calendar not connected. Please sign in again." };
  }

  const startsAt = event.startsAt;
  const endsAt = new Date(startsAt.getTime() + event.durationMinutes * 60 * 1000);

  const meetResult = await createCalendarEventWithMeet(
    tokens.accessToken,
    tokens.refreshToken,
    {
      title: event.title,
      description: tiptapToPlainText(event.description as TiptapJSON),
      start: startsAt,
      end: endsAt,
      timezone: event.timezone,
    }
  );

  if ("error" in meetResult) {
    return { error: meetResult.error };
  }

  await db.event.update({
    where: { id: eventId },
    data: {
      status: "published",
      meetLink: meetResult.meetLink,
      calendarEventId: meetResult.eventId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/events/${eventId}`);
  return { success: true };
}

export async function updateEvent(
  eventId: string,
  formData: {
    title?: string;
    subtitle?: string;
    description?: JSONContent;
    startsAt?: string;
    durationMinutes?: number;
    timezone?: string;
    speakers?: string;
    recordingUrl?: string;
    coverImageUrl?: string;
    media?: Array<{ type: "image" | "youtube"; url?: string; videoId?: string }>;
    registrationFields?: RegistrationField[];
    speakerIds?: string[];
  }
) {
  const session = await auth();
  const user = session?.user as { id?: string; orgId?: string | null };
  if (!user?.id || !user?.orgId) {
    return { error: "Unauthorized" };
  }

  const event = await db.event.findFirst({
    where: { id: eventId, orgId: user.orgId },
  });
  if (!event) return { error: "Event not found" };

  const updates: Record<string, unknown> = {};
  if (formData.title !== undefined) updates.title = formData.title;
  if (formData.subtitle !== undefined) updates.subtitle = formData.subtitle?.trim() || null;
  if (formData.description !== undefined) updates.description = formData.description;
  if (formData.startsAt !== undefined) updates.startsAt = new Date(formData.startsAt);
  if (formData.durationMinutes !== undefined) updates.durationMinutes = formData.durationMinutes;
  if (formData.timezone !== undefined) updates.timezone = formData.timezone;
  if (formData.speakers !== undefined) updates.speakers = formData.speakers?.trim() || null;
  if (formData.recordingUrl !== undefined) updates.recordingUrl = formData.recordingUrl?.trim() || null;
  if (formData.coverImageUrl !== undefined) updates.coverImageUrl = formData.coverImageUrl?.trim() || null;
  if (formData.media !== undefined) updates.media = formData.media;
  if (formData.registrationFields !== undefined) updates.registrationFields = formData.registrationFields;

  if (formData.title && formData.title !== event.title) {
    const slug = slugify(formData.title);
    const existing = await db.event.findUnique({
      where: { orgId_slug: { orgId: user.orgId, slug } },
    });
    if (existing && existing.id !== eventId) {
      return { error: "An event with this title already exists." };
    }
    updates.slug = slug;
  }

  const newStartsAt = formData.startsAt
    ? new Date(formData.startsAt)
    : event.startsAt;
  const newDurationMinutes = formData.durationMinutes ?? event.durationMinutes;
  const isReschedule =
    event.status === "published" &&
    (formData.startsAt || formData.durationMinutes) &&
    (newStartsAt.getTime() !== event.startsAt.getTime() ||
      newDurationMinutes !== event.durationMinutes);

  if (
    event.calendarEventId &&
    (formData.startsAt || formData.durationMinutes) &&
    event.status === "published"
  ) {
    const endsAt = new Date(
      newStartsAt.getTime() + newDurationMinutes * 60 * 1000
    );
    const tokens = await getGoogleTokens(user.id);
    if (tokens?.accessToken && tokens?.refreshToken) {
      await updateCalendarEvent(
        tokens.accessToken,
        tokens.refreshToken,
        event.calendarEventId,
        {
          title: (updates.title as string) ?? event.title,
          start: newStartsAt,
          end: endsAt,
          timezone: (updates.timezone as string) ?? event.timezone,
        }
      );
    }
  }

  await db.event.update({
    where: { id: eventId },
    data: updates,
  });

  if (formData.speakerIds !== undefined) {
    await db.eventSpeaker.deleteMany({ where: { eventId } });
    if (formData.speakerIds.length > 0) {
      await db.eventSpeaker.createMany({
        data: formData.speakerIds.map((speakerId, i) => ({
          eventId,
          speakerId,
          sortOrder: i,
        })),
      });
    }
  }

  if (isReschedule) {
    const registrations = await db.registration.findMany({
      where: { eventId, status: "confirmed" },
    });
    const updatedEvent = await db.event.findUnique({
      where: { id: eventId },
    });
    if (updatedEvent) {
      for (const reg of registrations) {
        try {
          await sendRescheduleEmail({
            to: reg.email,
            eventTitle: updatedEvent.title,
            oldStartsAt: event.startsAt,
            newStartsAt: updatedEvent.startsAt,
            durationMinutes: updatedEvent.durationMinutes,
            meetLink: updatedEvent.meetLink,
          });
        } catch {
          // Best-effort
        }
      }
    }
  }

  const newRecordingUrl = formData.recordingUrl?.trim() || null;
  if (newRecordingUrl && newRecordingUrl !== event.recordingUrl) {
    const registrations = await db.registration.findMany({
      where: { eventId, status: "confirmed" },
    });
    for (const reg of registrations) {
      try {
        await sendRecordingAvailableEmail({
          to: reg.email,
          eventTitle: (updates.title as string) ?? event.title,
          recordingUrl: newRecordingUrl,
        });
      } catch {
        // Best-effort
      }
    }
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/events/${eventId}`);
  return { success: true };
}

export async function cancelEvent(eventId: string) {
  const session = await auth();
  const user = session?.user as { id?: string; orgId?: string | null };
  if (!user?.id || !user?.orgId) {
    return { error: "Unauthorized" };
  }

  const event = await db.event.findFirst({
    where: { id: eventId, orgId: user.orgId },
    include: {
      registrations: {
        where: { status: "confirmed" },
      },
    },
  });
  if (!event) return { error: "Event not found" };

  if (event.calendarEventId) {
    const tokens = await getGoogleTokens(user.id);
    if (tokens?.accessToken && tokens?.refreshToken) {
      await deleteCalendarEvent(
        tokens.accessToken,
        tokens.refreshToken,
        event.calendarEventId
      );
    }
  }

  await db.event.update({
    where: { id: eventId },
    data: { status: "cancelled", meetLink: null, calendarEventId: null },
  });

  for (const reg of event.registrations) {
    try {
      await sendCancellationEmail({
        to: reg.email,
        eventTitle: event.title,
      });
    } catch {
      // Best-effort
    }
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/events/${eventId}`);
  return { success: true };
}

export async function cloneEvent(eventId: string) {
  const session = await auth();
  const user = session?.user as { id?: string; orgId?: string | null };
  if (!user?.id || !user?.orgId) {
    return { error: "Unauthorized" };
  }

  const event = await db.event.findFirst({
    where: { id: eventId, orgId: user.orgId },
    include: { eventSpeakers: { orderBy: { sortOrder: "asc" } } },
  });
  if (!event) return { error: "Event not found" };

  const baseSlug = event.slug;
  let slug = `${baseSlug}-copy`;
  let counter = 1;
  while (
    await db.event.findUnique({
      where: { orgId_slug: { orgId: user.orgId, slug } },
    })
  ) {
    slug = `${baseSlug}-copy-${++counter}`;
  }

  const newEvent = await db.event.create({
    data: {
      orgId: user.orgId,
      createdById: user.id,
      title: `${event.title} (Copy)`,
      slug,
      subtitle: event.subtitle,
      description: event.description ?? undefined,
      startsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      durationMinutes: event.durationMinutes,
      timezone: event.timezone,
      speakers: event.speakers,
      coverImageUrl: event.coverImageUrl,
      ...(event.media && { media: event.media }),
      ...(event.registrationFields && { registrationFields: event.registrationFields }),
      status: "draft",
    },
  });

  if (event.eventSpeakers.length > 0) {
    await db.eventSpeaker.createMany({
      data: event.eventSpeakers.map((es) => ({
        eventId: newEvent.id,
        speakerId: es.speakerId,
        sortOrder: es.sortOrder,
      })),
    });
  }

  revalidatePath("/dashboard");
  return { success: true, eventId: newEvent.id };
}
