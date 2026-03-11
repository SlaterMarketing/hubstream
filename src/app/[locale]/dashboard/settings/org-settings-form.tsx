"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateOrganization } from "@/app/actions/organization";

type Props = {
  name: string;
  slug: string;
};

export function OrgSettingsForm({ name, slug }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const form = e.currentTarget;
    const result = await updateOrganization({
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      slug: (form.elements.namedItem("slug") as HTMLInputElement).value,
    });

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Organization name
        </label>
        <Input
          id="name"
          name="name"
          defaultValue={name}
          className="mt-1"
          required
        />
      </div>
      <div>
        <label htmlFor="slug" className="text-sm font-medium">
          URL slug
        </label>
        <Input
          id="slug"
          name="slug"
          defaultValue={slug}
          className="mt-1"
          placeholder="my-org"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Used in event URLs: hubstream.app/{slug}/event-name
        </p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600 dark:text-green-400">Saved.</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
