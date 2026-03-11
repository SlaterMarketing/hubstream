"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  message: string;
};

export function UpgradePrompt({ message }: Props) {
  return (
    <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
      <p className="text-sm text-amber-800 dark:text-amber-200">{message}</p>
      <Link href="/dashboard/settings" className="mt-2 inline-block">
        <Button size="sm" variant="outline">
          Upgrade to Pro
        </Button>
      </Link>
    </div>
  );
}
