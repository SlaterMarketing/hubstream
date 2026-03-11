"use client";

import { Button } from "@/components/ui/button";

export function GoogleCalendarConnect({
  connected,
  reconnectAction,
}: {
  connected: boolean;
  reconnectAction: () => Promise<void>;
}) {
  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-600 dark:text-green-400">
          Google Calendar is connected.
        </span>
        <form action={reconnectAction}>
          <Button type="submit" variant="outline" size="sm">
            Reconnect
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-destructive">
        Google Calendar is not connected. Publishing events requires Calendar access.
      </p>
      <form action={reconnectAction}>
        <Button type="submit" variant="outline" size="sm">
          Reconnect Google Calendar
        </Button>
      </form>
    </div>
  );
}
