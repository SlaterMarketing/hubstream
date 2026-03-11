"use client";

import { useState, useRef } from "react";
import { UploadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (url: string) => void;
  type?: "cover" | "event" | "speaker";
  className?: string;
};

export function ImageUpload({ value, onChange, type = "event", className }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const res = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          type,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const uploadRes = await fetch(data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) throw new Error("Upload failed");

      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative flex min-h-[120px] items-center justify-center rounded-lg border-2 border-dashed transition-colors",
          value ? "border-transparent" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Upload"
              className="h-full w-full rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => onChange("")}
            >
              <XIcon className="size-4" />
            </Button>
          </>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-2 p-4">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <UploadIcon className="size-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {uploading ? "Uploading..." : "Upload image"}
            </span>
          </label>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
