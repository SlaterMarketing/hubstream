"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HubSpotSetupInstructions({ redirectUri }: { redirectUri: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function copyToClipboard(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="rounded-lg border border-muted bg-muted/30">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-muted/50"
      >
        <span>Developer setup: Create a HubSpot app</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="space-y-4 border-t border-muted px-4 py-3 text-sm">
          <p className="text-muted-foreground">
            To connect HubSpot, create an app in your HubSpot developer account and add the Client ID and Secret to your environment.
          </p>
          <div>
            <p className="mb-1 font-medium">1. Install the HubSpot CLI</p>
            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 font-mono text-xs">
              <code className="flex-1">npm i -g @hubspot/cli</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => copyToClipboard("npm i -g @hubspot/cli", "cli")}
              >
                {copied === "cli" ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-1 font-medium">2. Create a project</p>
            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 font-mono text-xs">
              <code className="flex-1">hs project create</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => copyToClipboard("hs project create", "create")}
              >
                {copied === "create" ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <p className="mt-1 text-muted-foreground">
              Or create an app at{" "}
              <a
                href="https://developers.hubspot.com/docs/api/creating-an-app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                developers.hubspot.com
              </a>
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium">3. Configure redirect URI</p>
            <p className="mb-1 text-muted-foreground">
              In your HubSpot app settings, add this redirect URI:
            </p>
            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 font-mono text-xs">
              <code className="flex-1 break-all">{redirectUri}</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => copyToClipboard(redirectUri, "redirect")}
              >
                {copied === "redirect" ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-1 font-medium">4. Add credentials to .env</p>
            <p className="text-muted-foreground">
              Set <code className="rounded bg-muted px-1">HUBSPOT_CLIENT_ID</code> and{" "}
              <code className="rounded bg-muted px-1">HUBSPOT_CLIENT_SECRET</code> from your app&apos;s Auth tab.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Custom registration fields sync to HubSpot contact properties. Create matching properties in HubSpot (Settings → Properties → Contact) using lowercase names with underscores (e.g. <code className="rounded bg-muted px-1">industry</code>, <code className="rounded bg-muted px-1">job_role</code>).
          </p>
        </div>
      )}
    </div>
  );
}
