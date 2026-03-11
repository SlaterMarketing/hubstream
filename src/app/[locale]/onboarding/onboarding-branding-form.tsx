"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/event-page-editor/image-upload";
import { updateOrganization } from "@/app/actions/organization";

type Props = {
  orgId: string;
  logoUrl: string | null;
  ctaColor: string | null;
};

export function OnboardingBrandingForm({ orgId, logoUrl, ctaColor }: Props) {
  const router = useRouter();
  const [logo, setLogo] = useState(logoUrl ?? "");
  const [color, setColor] = useState(ctaColor ?? "#ff724c");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await updateOrganization({ logoUrl: logo || null, ctaColor: color || null });
      if (result.error) throw new Error(result.error);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleSkip() {
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add your branding (optional)</CardTitle>
        <CardDescription>
          Customise your logo and button colour on event pages. You can change these later in settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Logo</label>
            <p className="text-xs text-muted-foreground mb-2">
              Shown in the header of your event pages instead of the HubStream logo
            </p>
            <ImageUpload
              value={logo}
              onChange={setLogo}
              type="logo"
              objectFit="contain"
              className="min-h-[80px]"
            />
          </div>
          <div>
            <label htmlFor="ctaColor" className="text-sm font-medium">
              CTA button colour
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Used for Register and other buttons on your event pages
            </p>
            <div className="flex items-center gap-2 mt-1">
              <input
                id="ctaColor"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded border border-input bg-transparent p-1"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#ff724c"
                className="h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save & continue"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
