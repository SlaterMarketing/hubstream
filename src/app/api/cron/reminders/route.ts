import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendReminderEmail } from "@/lib/email";

export const maxDuration = 60;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in23h = new Date(now.getTime() + 23 * 60 * 60 * 1000);
  const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);
  const in50min = new Date(now.getTime() + 50 * 60 * 1000);
  const in70min = new Date(now.getTime() + 70 * 60 * 1000);

  const events24h = await db.event.findMany({
    where: {
      status: "published",
      startsAt: { gte: in23h, lt: in25h },
    },
    include: {
      registrations: {
        where: { status: "confirmed", unsubscribed: false },
      },
    },
  });

  const events1h = await db.event.findMany({
    where: {
      status: "published",
      startsAt: { gte: in50min, lt: in70min },
    },
    include: {
      registrations: {
        where: { status: "confirmed", unsubscribed: false },
      },
    },
  });

  let sent = 0;
  for (const event of events24h) {
    for (const reg of event.registrations) {
      try {
        await sendReminderEmail({
          to: reg.email,
          eventTitle: event.title,
          startsAt: event.startsAt,
          durationMinutes: event.durationMinutes,
          meetLink: event.meetLink,
          cancelToken: reg.cancelToken,
          hoursUntil: 24,
        });
        sent++;
      } catch {
        // Continue
      }
    }
  }

  for (const event of events1h) {
    for (const reg of event.registrations) {
      try {
        await sendReminderEmail({
          to: reg.email,
          eventTitle: event.title,
          startsAt: event.startsAt,
          durationMinutes: event.durationMinutes,
          meetLink: event.meetLink,
          cancelToken: reg.cancelToken,
          hoursUntil: 1,
        });
        sent++;
      } catch {
        // Continue
      }
    }
  }

  return NextResponse.json({ sent });
}
