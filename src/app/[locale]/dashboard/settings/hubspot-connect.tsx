"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HubSpotConnect({ connected }: { connected: boolean }) {
  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">HubSpot is connected.</span>
        <a
          href="/api/hubspot/auth"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Reconnect
        </a>
      </div>
    );
  }

  return (
    <a
      href="/api/hubspot/auth"
      className={cn(buttonVariants())}
    >
      Connect HubSpot
    </a>
  );
}
