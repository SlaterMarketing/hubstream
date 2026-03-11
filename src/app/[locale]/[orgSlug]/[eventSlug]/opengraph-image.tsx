import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
export const alt = "Event";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ orgSlug: string; eventSlug: string }>;
};

export default async function Image({ params }: Props) {
  const { orgSlug, eventSlug } = await params;

  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
    select: { id: true, name: true },
  });
  const event = org
    ? await db.event.findFirst({
        where: { slug: eventSlug, orgId: org.id },
      })
    : null;

  if (!event || !org) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: "linear-gradient(135deg, #171717 0%, #262626 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <span style={{ color: "#ff724c" }}>Hub</span>
          <span style={{ color: "white" }}>Stream</span>
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(135deg, #171717 0%, #262626 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: 60,
        }}
      >
        <div style={{ fontSize: 56, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>
          {event.title}
        </div>
        <div style={{ fontSize: 24, color: "#a3a3a3", marginBottom: 8 }}>
          {event.startsAt.toLocaleDateString(undefined, { dateStyle: "long" })}
        </div>
        {event.speakers && (
          <div style={{ fontSize: 20, color: "#737373" }}>
            {event.speakers}
          </div>
        )}
        <div style={{ fontSize: 18, color: "#525252", marginTop: 24 }}>
          {org.name} • <span style={{ color: "#ff724c" }}>Hub</span><span style={{ color: "#525252" }}>Stream</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
