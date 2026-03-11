"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cancelRegistration } from "@/app/actions/registrations";

export function CancelButton({ cancelToken }: { cancelToken: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleCancel() {
    setLoading(true);
    const result = await cancelRegistration(cancelToken);
    setLoading(false);
    if (result.error) {
      setDone(true);
    } else {
      setDone(true);
      router.refresh();
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-center">
        <p className="font-medium text-green-700 dark:text-green-400">
          Your registration has been cancelled.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="destructive" onClick={handleCancel} disabled={loading}>
        {loading ? "Cancelling..." : "Yes, cancel my registration"}
      </Button>
      <Button variant="outline" onClick={() => router.back()} disabled={loading}>
        Go back
      </Button>
    </div>
  );
}
