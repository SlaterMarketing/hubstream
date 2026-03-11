"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  embedUrl: string;
};

export function EmbedCodeSnippet({ embedUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="400" frameborder="0" title="Event registration"></iframe>`;

  async function copyToClipboard() {
    await navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Copy this code to embed the registration form on your website:
      </p>
      <pre className="rounded-md bg-muted p-4 text-xs overflow-x-auto">
        <code>{iframeCode}</code>
      </pre>
      <Button variant="outline" size="sm" onClick={copyToClipboard}>
        {copied ? "Copied!" : "Copy embed code"}
      </Button>
    </div>
  );
}
