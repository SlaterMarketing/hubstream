"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ExportCsvButton({ eventId }: { eventId: string }) {
  const href = `/api/events/${eventId}/registrations/csv`;

  return (
    <a
      href={href}
      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
    >
      Export CSV
    </a>
  );
}
