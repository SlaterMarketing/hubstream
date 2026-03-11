import { google } from "googleapis";

export async function createCalendarEventWithMeet(
  accessToken: string,
  refreshToken: string,
  event: {
    title: string;
    description?: string;
    start: Date;
    end: Date;
    timezone: string;
  }
): Promise<{ meetLink: string; eventId: string } | { error: string }> {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: event.timezone,
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: event.timezone,
        },
        conferenceData: {
          createRequest: {
            requestId: `hubstream-${Date.now()}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
    });

    const meetLink = response.data.conferenceData?.entryPoints?.find(
      (e) => e.entryPointType === "video"
    )?.uri;
    const eventId = response.data.id;

    if (meetLink && eventId) {
      return { meetLink, eventId };
    }
    return { error: "No Meet link in response" };
  } catch (error: unknown) {
    const err = error as { message?: string; code?: number; response?: { data?: { error?: { message?: string; code?: number } } } };
    const message = err?.response?.data?.error?.message ?? err?.message ?? "Unknown error";
    const code = err?.response?.data?.error?.code ?? err?.code;
    console.error("Google Calendar API error:", error);
    if (code === 401 || message.includes("invalid_grant") || message.includes("Token has been expired") || message.includes("Invalid Credentials")) {
      return { error: "Token expired or revoked. Please reconnect Google Calendar in Settings." };
    }
    if (code === 403 || message.includes("access_denied") || message.includes("Forbidden") || message.includes("Calendar API has not been used")) {
      return { error: "Calendar access denied. Enable the Google Calendar API in your GCP project and reconnect in Settings." };
    }
    return { error: message || "Failed to create calendar event" };
  }
}

export async function updateCalendarEvent(
  accessToken: string,
  refreshToken: string,
  eventId: string,
  event: {
    title: string;
    description?: string;
    start: Date;
    end: Date;
    timezone: string;
  }
): Promise<boolean> {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    await calendar.events.patch({
      calendarId: "primary",
      eventId,
      requestBody: {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: event.timezone,
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: event.timezone,
        },
      },
    });
    return true;
  } catch (error) {
    console.error("Google Calendar API update error:", error);
    return false;
  }
}

/** Add an attendee to an existing event. Google sends the calendar invite from the organizer's Gmail. */
export async function addAttendeeToCalendarEvent(
  accessToken: string,
  refreshToken: string,
  calendarEventId: string,
  attendeeEmail: string
): Promise<boolean> {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const existing = await calendar.events.get({
      calendarId: "primary",
      eventId: calendarEventId,
    });

    const currentAttendees = existing.data.attendees ?? [];
    const emails = new Set(currentAttendees.map((a) => a.email?.toLowerCase()).filter(Boolean));
    if (emails.has(attendeeEmail.toLowerCase())) {
      return true; // Already invited
    }

    await calendar.events.patch({
      calendarId: "primary",
      eventId: calendarEventId,
      requestBody: {
        attendees: [
          ...currentAttendees.map((a) => ({ email: a.email })),
          { email: attendeeEmail },
        ],
      },
      sendUpdates: "all",
    });
    return true;
  } catch (error) {
    console.error("Google Calendar add attendee error:", error);
    return false;
  }
}

export async function deleteCalendarEvent(
  accessToken: string,
  refreshToken: string,
  eventId: string
): Promise<boolean> {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });
    return true;
  } catch (error) {
    console.error("Google Calendar API delete error:", error);
    return false;
  }
}
