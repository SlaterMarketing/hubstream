import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createHash } from "crypto";
import { db } from "@/lib/db";

function getDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    if (/ipad|tablet|playbook|silk/i.test(ua)) return "tablet";
    return "mobile";
  }
  return "desktop";
}

function stripReferrerDomain(referrer: string): string {
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return referrer.slice(0, 255);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventId = body.eventId as string;
    if (!eventId) {
      return NextResponse.json({ error: "eventId required" }, { status: 400 });
    }

    const event = await db.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headersList.get("x-real-ip") ?? "0.0.0.0";
    const userAgent = headersList.get("user-agent") ?? "";
    const country = headersList.get("x-vercel-ip-country") ?? null;

    const today = new Date().toISOString().slice(0, 10);
    const hashInput = `${ip}|${userAgent}|${today}`;
    const visitorHash = createHash("sha256").update(hashInput).digest("hex");

    const referrer = body.referrer ? stripReferrerDomain(body.referrer) : null;
    const utmSource = (body.utmSource as string)?.slice(0, 255) ?? null;
    const utmMedium = (body.utmMedium as string)?.slice(0, 255) ?? null;
    const utmCampaign = (body.utmCampaign as string)?.slice(0, 255) ?? null;
    const device = getDevice(userAgent);

    await db.pageView.create({
      data: {
        eventId,
        visitorHash,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        country,
        device,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
