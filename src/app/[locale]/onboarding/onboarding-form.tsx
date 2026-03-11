"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  userId: string;
};

export function OnboardingForm({ userId }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (!slug || slug === name.toLowerCase().replace(/\s+/g, "-")) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create organization");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your organization</CardTitle>
        <CardDescription>
          Set up your organization to start creating webinars
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Organization name
            </label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Acme Inc"
              required
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="slug" className="text-sm font-medium">
              URL slug
            </label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="acme-inc"
              required
              className="mt-1"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Your event pages will be at hubstream.app/{slug || "..."}/event-name
            </p>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create organization"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
