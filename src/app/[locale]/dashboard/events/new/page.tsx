"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { createEvent } from "@/app/actions/events";

export default function NewEventPage() {
  const router = useRouter();

  useEffect(() => {
    const defaultStartsAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
    createEvent({
      title: "Untitled Event",
      startsAt: defaultStartsAt,
      durationMinutes: 60,
      timezone: "UTC",
    }).then((result) => {
      if ("eventId" in result && result.eventId) {
        router.replace(`/dashboard/events/${result.eventId}`);
      }
    });
  }, [router]);

  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <p className="text-muted-foreground">Creating event...</p>
    </div>
  );
}
