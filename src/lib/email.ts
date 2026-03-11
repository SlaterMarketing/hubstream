import { Resend } from "resend";
import { render } from "@react-email/render";
import { ConfirmationEmail } from "@/emails/confirmation";
import { ReminderEmail } from "@/emails/reminder";
import { CancellationEmail } from "@/emails/cancellation";
import { RescheduleEmail } from "@/emails/reschedule";
import { RecordingAvailableEmail } from "@/emails/recording-available";
import { InviteEmail } from "@/emails/invite";
import { generateIcs } from "./ics";

function getResend() {
  const key = process.env.RESEND_API_KEY ?? "dummy-key-for-build";
  return new Resend(key);
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "HubStream <noreply@mail.hubstream.app>";
const BASE_URL = process.env.NEXTAUTH_URL ?? "https://hubstream.app";

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: string }[];
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping email");
    return { success: false, error: "Email not configured" };
  }

  const { data, error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    attachments: attachments?.map((a) => ({
      filename: a.filename,
      content: Buffer.from(a.content, "utf-8").toString("base64"),
    })),
  });

  if (error) {
    console.error("Resend error:", error);
    return { success: false, error: String(error) };
  }
  return { success: true, id: data?.id };
}

export async function sendConfirmationEmail(data: {
  to: string;
  eventTitle: string;
  startsAt: Date;
  durationMinutes: number;
  meetLink?: string | null;
  cancelToken: string;
}) {
  const startsAtStr = data.startsAt.toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
  const html = await render(
    ConfirmationEmail({
      eventTitle: data.eventTitle,
      startsAt: startsAtStr,
      durationMinutes: data.durationMinutes,
      meetLink: data.meetLink ?? undefined,
      cancelUrl: `${BASE_URL}/registrations/${data.cancelToken}/cancel`,
      unsubscribeUrl: `${BASE_URL}/registrations/${data.cancelToken}/unsubscribe`,
    })
  );
  const endAt = new Date(
    data.startsAt.getTime() + data.durationMinutes * 60 * 1000
  );
  const ics = generateIcs({
    title: data.eventTitle,
    start: data.startsAt,
    end: endAt,
    location: data.meetLink ?? undefined,
    url: data.meetLink ?? undefined,
  });
  return sendEmail({
    to: data.to,
    subject: `You're registered: ${data.eventTitle}`,
    html,
    attachments: [{ filename: "event.ics", content: ics }],
  });
}

export async function sendReminderEmail(data: {
  to: string;
  eventTitle: string;
  startsAt: Date;
  durationMinutes: number;
  meetLink?: string | null;
  cancelToken: string;
  hoursUntil: number;
}) {
  const startsAtStr = data.startsAt.toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
  const html = await render(
    ReminderEmail({
      eventTitle: data.eventTitle,
      startsAt: startsAtStr,
      durationMinutes: data.durationMinutes,
      meetLink: data.meetLink ?? undefined,
      cancelUrl: `${BASE_URL}/registrations/${data.cancelToken}/cancel`,
      unsubscribeUrl: `${BASE_URL}/registrations/${data.cancelToken}/unsubscribe`,
      hoursUntil: data.hoursUntil,
    })
  );
  return sendEmail({
    to: data.to,
    subject: `Reminder: ${data.eventTitle} in ${data.hoursUntil}h`,
    html,
  });
}

export async function sendCancellationEmail(data: {
  to: string;
  eventTitle: string;
}) {
  const html = await render(CancellationEmail({ eventTitle: data.eventTitle }));
  return sendEmail({
    to: data.to,
    subject: `Cancelled: ${data.eventTitle}`,
    html,
  });
}

export async function sendRescheduleEmail(data: {
  to: string;
  eventTitle: string;
  oldStartsAt: Date;
  newStartsAt: Date;
  durationMinutes: number;
  meetLink?: string | null;
}) {
  const html = await render(
    RescheduleEmail({
      eventTitle: data.eventTitle,
      oldStartsAt: data.oldStartsAt.toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "short",
      }),
      newStartsAt: data.newStartsAt.toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "short",
      }),
      durationMinutes: data.durationMinutes,
      meetLink: data.meetLink ?? undefined,
    })
  );
  return sendEmail({
    to: data.to,
    subject: `Rescheduled: ${data.eventTitle}`,
    html,
  });
}

export async function sendRecordingAvailableEmail(data: {
  to: string;
  eventTitle: string;
  recordingUrl: string;
}) {
  const html = await render(
    RecordingAvailableEmail({
      eventTitle: data.eventTitle,
      recordingUrl: data.recordingUrl,
    })
  );
  return sendEmail({
    to: data.to,
    subject: `Recording available: ${data.eventTitle}`,
    html,
  });
}

export async function sendInviteEmail(data: {
  to: string;
  orgName: string;
  inviterName?: string;
  inviteUrl: string;
  expiresInDays: number;
}) {
  const html = await render(
    InviteEmail({
      orgName: data.orgName,
      inviterName: data.inviterName,
      inviteUrl: data.inviteUrl,
      expiresInDays: data.expiresInDays,
    })
  );
  return sendEmail({
    to: data.to,
    subject: `You're invited to join ${data.orgName} on HubStream`,
    html,
  });
}
