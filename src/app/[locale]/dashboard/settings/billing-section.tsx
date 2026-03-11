"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  plan: string;
  hasSubscription: boolean;
};

export function BillingSection({ plan, hasSubscription }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(interval: "month" | "year") {
    setLoading(interval);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.error) alert(data.error);
    } finally {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.error) alert(data.error);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Current plan: <strong className="text-foreground">{plan}</strong>
      </p>
      {plan === "pro" && hasSubscription ? (
        <Button
          variant="outline"
          onClick={handlePortal}
          disabled={!!loading}
        >
          {loading === "portal" ? "Opening..." : "Manage billing"}
        </Button>
      ) : plan === "free" ? (
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleCheckout("month")}
            disabled={!!loading}
          >
            {loading === "month" ? "Redirecting..." : "Upgrade to Pro ($10/mo)"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleCheckout("year")}
            disabled={!!loading}
          >
            {loading === "year" ? "Redirecting..." : "Upgrade to Pro ($99/yr)"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
