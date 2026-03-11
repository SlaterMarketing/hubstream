"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { disconnectHubSpot } from "@/app/actions/integrations";

export function HubSpotConnect({ connected, locale = "en" }: { connected: boolean; locale?: string }) {
  const [disconnecting, setDisconnecting] = useState(false);
  const router = useRouter();

  async function handleDisconnect() {
    setDisconnecting(true);
    const result = await disconnectHubSpot();
    setDisconnecting(false);
    if (result.success) {
      router.refresh();
    }
  }

  if (connected) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">HubSpot is connected.</span>
        <a
          href={`/api/hubspot/auth?locale=${encodeURIComponent(locale)}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Reconnect
        </a>
        <button
          type="button"
          onClick={handleDisconnect}
          disabled={disconnecting}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground hover:text-destructive")}
        >
          {disconnecting ? "Disconnecting..." : "Disconnect"}
        </button>
      </div>
    );
  }

  return (
    <a
      href={`/api/hubspot/auth?locale=${encodeURIComponent(locale)}`}
      className={cn(buttonVariants())}
    >
      Connect HubSpot
    </a>
  );
}
