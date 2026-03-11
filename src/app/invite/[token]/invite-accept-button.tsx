"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  token: string;
};

export function InviteAcceptButton({ token }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);
    try {
      const res = await fetch("/api/invites/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.redirect) {
        router.push(data.redirect);
      } else if (data.error) {
        alert(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleAccept} disabled={loading}>
      {loading ? "Accepting..." : "Accept invite"}
    </Button>
  );
}
