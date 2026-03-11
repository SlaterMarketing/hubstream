"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerForEvent } from "@/app/actions/registrations";

type Props = {
  eventId: string;
  locale?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  showPoweredBy?: boolean;
};

export function RegistrationForm({
  eventId,
  locale,
  utmSource,
  utmMedium,
  utmCampaign,
  showPoweredBy = false,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const result = await registerForEvent(eventId, {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      jobTitle: (form.elements.namedItem("jobTitle") as HTMLInputElement).value,
      utmSource: utmSource ?? (form.elements.namedItem("utm_source") as HTMLInputElement)?.value,
      utmMedium: utmMedium ?? (form.elements.namedItem("utm_medium") as HTMLInputElement)?.value,
      utmCampaign: utmCampaign ?? (form.elements.namedItem("utm_campaign") as HTMLInputElement)?.value,
      locale: locale ?? undefined,
      consent: (form.elements.namedItem("consent") as HTMLInputElement).checked,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-center">
        <p className="font-medium text-green-700 dark:text-green-400">
          You&apos;re registered! Check your email for the meeting link.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="text-sm font-medium">
              First name
            </label>
            <Input id="firstName" name="firstName" className="mt-1" />
          </div>
          <div>
            <label htmlFor="lastName" className="text-sm font-medium">
              Last name
            </label>
            <Input id="lastName" name="lastName" className="mt-1" />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="company" className="text-sm font-medium">
            Company
          </label>
          <Input id="company" name="company" className="mt-1" />
        </div>
        <div>
          <label htmlFor="jobTitle" className="text-sm font-medium">
            Job title
          </label>
          <Input id="jobTitle" name="jobTitle" className="mt-1" />
        </div>
        <div className="flex items-start gap-2">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1"
          />
          <label htmlFor="consent" className="text-sm">
            I agree to receive communications about this event.{" "}
            <a href="/en/privacy" className="text-primary hover:underline">
              Privacy policy
            </a>
          </label>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
      {showPoweredBy && (
        <p className="text-center text-xs text-muted-foreground">
          Powered by{" "}
          <a
            href="https://hubstream.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            HubStream
          </a>
        </p>
      )}
    </div>
  );
}
