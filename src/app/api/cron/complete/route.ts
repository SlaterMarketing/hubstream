import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const maxDuration = 30;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const events = await db.event.findMany({
    where: { status: "published" },
    select: { id: true, startsAt: true, durationMinutes: true },
  });

  let updated = 0;
  for (const event of events) {
    const endAt = new Date(
      event.startsAt.getTime() + event.durationMinutes * 60 * 1000
    );
    if (endAt <= now) {
      await db.event.update({
        where: { id: event.id },
        data: { status: "completed" },
      });
      updated++;
    }
  }

  return NextResponse.json({ updated });
}
