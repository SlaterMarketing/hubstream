"use client";

import { useEffect } from "react";

type Props = {
  eventId: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export function PageViewTracker({
  eventId,
  referrer,
  utmSource,
  utmMedium,
  utmCampaign,
}: Props) {
  useEffect(() => {
    const payload = {
      eventId,
      referrer: referrer ?? (typeof document !== "undefined" ? document.referrer : ""),
      utmSource: utmSource ?? undefined,
      utmMedium: utmMedium ?? undefined,
      utmCampaign: utmCampaign ?? undefined,
    };
    const data = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  }, [eventId, referrer, utmSource, utmMedium, utmCampaign]);

  return null;
}
