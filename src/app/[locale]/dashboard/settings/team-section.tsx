"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type Member = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  image: string | null;
};

type PendingInvite = {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
};

type Props = {
  plan: string;
  members: Member[];
  invites: PendingInvite[];
  currentUserId: string;
  currentUserRole: string;
};

export function TeamSection({
  plan,
  members,
  invites,
  currentUserId,
  currentUserRole,
}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPro = plan === "pro";
  const canManage = currentUserRole === "owner" || currentUserRole === "admin";

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!isPro || !canManage) return;
    setError(null);
    setLoading("invite");
    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setEmail("");
        setRole("member");
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  }

  async function handleRevokeInvite(inviteId: string) {
    if (!canManage) return;
    setLoading(`revoke-${inviteId}`);
    try {
      const res = await fetch(`/api/invites/${inviteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  }

  async function handleRemoveMember(userId: string) {
    if (!canManage) return;
    setLoading(`remove-${userId}`);
    try {
      const res = await fetch(`/api/team/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <CardDescription>
          {isPro
            ? "Invite team members to collaborate on events. Invites are sent via email."
            : "Upgrade to Pro to invite unlimited team members."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {isPro && canManage && (
          <form onSubmit={handleInvite} className="flex flex-wrap gap-2">
            <Input
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-[220px]"
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "member" | "admin")}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <Button type="submit" disabled={!!loading}>
              {loading === "invite" ? "Sending..." : "Send invite"}
            </Button>
          </form>
        )}

        {!isPro && (
          <p className="text-sm text-muted-foreground">
            <Link href="#billing" className="text-primary underline">
              Upgrade to Pro
            </Link>{" "}
            to add team members and send invite emails.
          </p>
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium">Members</p>
          <ul className="divide-y divide-border rounded-md border">
            {members.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {m.image ? (
                    <img
                      src={m.image}
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {(m.name || m.email)[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{m.name || m.email}</p>
                    <p className="text-sm text-muted-foreground">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                    {m.role}
                  </span>
                  {canManage &&
                    m.role !== "owner" &&
                    m.id !== currentUserId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(m.id)}
                        disabled={!!loading}
                      >
                        {loading === `remove-${m.id}` ? "..." : "Remove"}
                      </Button>
                    )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {isPro && invites.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Pending invites</p>
            <ul className="divide-y divide-border rounded-md border">
              {invites.map((inv) => (
                <li
                  key={inv.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{inv.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {inv.role} · expires{" "}
                      {new Date(inv.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  {canManage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeInvite(inv.id)}
                      disabled={!!loading}
                    >
                      {loading === `revoke-${inv.id}` ? "..." : "Revoke"}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
