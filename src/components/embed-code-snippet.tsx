"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  embedUrl: string;
};

export function EmbedCodeSnippet({ embedUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const iframeCode = `<iframe id="hubstream-embed" src="${embedUrl}" width="100%" height="480" frameborder="0" title="Event registration"></iframe>
<script>
  window.addEventListener("message", function(e) {
    if (e.data?.type === "hubstream-embed-resize" && e.data?.height) {
      var iframe = document.getElementById("hubstream-embed");
      if (iframe) iframe.style.height = e.data.height + "px";
    }
  });
</script>`;

  async function copyToClipboard() {
    await navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Copy this code to embed the registration form on your website. The
        iframe will auto-resize to fit the form.
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
