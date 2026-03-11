"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/event-page-editor/image-upload";
import { updateOrganization } from "@/app/actions/organization";

type Props = {
  name: string;
  slug: string;
  logoUrl: string | null;
  ctaColor: string | null;
};

export function OrgSettingsForm({ name, slug, logoUrl, ctaColor }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [logo, setLogo] = useState(logoUrl ?? "");
  const [color, setColor] = useState(ctaColor ?? "#ff724c");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const form = e.currentTarget;
    const result = await updateOrganization({
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      slug: (form.elements.namedItem("slug") as HTMLInputElement).value,
      logoUrl: logo || null,
      ctaColor: color || null,
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
      <div>
        <label className="text-sm font-medium">Logo</label>
        <p className="text-xs text-muted-foreground mb-2">
          Shown on your event pages instead of the HubStream logo. Optional.
        </p>
        <ImageUpload value={logo} onChange={setLogo} type="logo" objectFit="contain" className="min-h-[80px]" />
      </div>
      <div>
        <label htmlFor="ctaColor" className="text-sm font-medium">
          CTA button colour
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Used for Register and other buttons on your event pages. Optional.
        </p>
        <div className="flex items-center gap-2 mt-1">
          <input
            id="ctaColor"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded border border-input bg-transparent p-1"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#ff724c"
            className="flex-1"
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600 dark:text-green-400">Saved.</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
