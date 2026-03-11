"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { upgradeOrgToPro, downgradeOrgToFree } from "@/app/actions/admin";

type Props = {
  orgId: string;
  orgName: string;
  plan: string;
};

export function AdminUpgradeButton({ orgId, orgName, plan }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    const result =
      plan === "pro"
        ? await downgradeOrgToFree(orgId)
        : await upgradeOrgToPro(orgId);
    setLoading(false);
    if (result.success) {
      router.refresh();
    }
  }

  return (
    <Button
      variant={plan === "pro" ? "outline" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? "..." : plan === "pro" ? "Downgrade" : "Upgrade to Pro"}
    </Button>
  );
}
