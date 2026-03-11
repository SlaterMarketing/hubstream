"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { Input } from "@/components/ui/input";
import { registerForEvent } from "@/app/actions/registrations";

type RegistrationField = {
  key: string;
  label: string;
  type: "text" | "select" | "checkbox";
  required?: boolean;
  options?: string[];
};

const DEFAULT_FIELDS: RegistrationField[] = [
  { key: "firstName", label: "First name", type: "text", required: false },
  { key: "lastName", label: "Last name", type: "text", required: false },
  { key: "company", label: "Company", type: "text", required: false },
  { key: "jobTitle", label: "Job title", type: "text", required: false },
];

type Props = {
  eventId: string;
  locale?: string;
  registrationFields?: RegistrationField[];
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  showPoweredBy?: boolean;
};

export function RegistrationForm({
  eventId,
  locale,
  registrationFields = DEFAULT_FIELDS,
  utmSource,
  utmMedium,
  utmCampaign,
  showPoweredBy = false,
}: Props) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const fieldValues: Record<string, string | boolean> = {};
    for (const field of registrationFields) {
      const el = form.elements.namedItem(field.key) as HTMLInputElement | null;
      if (el) {
        if (field.type === "checkbox") {
          fieldValues[field.key] = el.checked;
        } else {
          fieldValues[field.key] = el.value;
        }
      }
    }

    const result = await registerForEvent(eventId, {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      firstName: (fieldValues.firstName as string)?.trim() || undefined,
      lastName: (fieldValues.lastName as string)?.trim() || undefined,
      company: (fieldValues.company as string)?.trim() || undefined,
      jobTitle: (fieldValues.jobTitle as string)?.trim() || undefined,
      customFieldValues: fieldValues,
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
        {registrationFields.map((field) => (
          <div key={field.key}>
            <label htmlFor={field.key} className="text-sm font-medium">
              {field.label} {field.required ? "*" : ""}
            </label>
            {field.type === "text" && (
              <Input
                id={field.key}
                name={field.key}
                className="mt-1"
                required={field.required}
              />
            )}
            {field.type === "select" && (
              <select
                id={field.key}
                name={field.key}
                required={field.required}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3"
              >
                <option value="">Select...</option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
            {field.type === "checkbox" && (
              <div className="mt-1 flex items-center gap-2">
                <input
                  id={field.key}
                  name={field.key}
                  type="checkbox"
                  required={field.required}
                />
                <label htmlFor={field.key} className="text-sm">
                  {field.label}
                </label>
              </div>
            )}
          </div>
        ))}
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
            className="hover:underline inline-flex items-center"
          >
            <BrandLogo showImage={false} size="sm" />
          </a>
        </p>
      )}
    </div>
  );
}
