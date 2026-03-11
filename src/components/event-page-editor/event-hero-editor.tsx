"use client";

import { useState, useRef } from "react";
import { ImagePlusIcon } from "lucide-react";
import { InlineEditableText, InlineEditableDateTime } from "./inline-editable";
import { ImageUpload } from "./image-upload";
import { EventPageHeader } from "@/components/event-page-header";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle: string;
  startsAt: string;
  durationMinutes: number;
  timezone: string;
  coverImageUrl: string;
  onTitleChange: (v: string) => void;
  onSubtitleChange: (v: string) => void;
  onStartsAtChange: (v: string) => void;
  onDurationChange: (v: number) => void;
  onTimezoneChange: (v: string) => void;
  onCoverImageChange: (v: string) => void;
};

export function EventHeroEditor({
  title,
  subtitle,
  startsAt,
  durationMinutes,
  timezone,
  coverImageUrl,
  onTitleChange,
  onSubtitleChange,
  onStartsAtChange,
  onDurationChange,
  onCoverImageChange,
}: Props) {
  const [showCoverUpload, setShowCoverUpload] = useState(false);
  const hasCoverImage = !!coverImageUrl;

  return (
    <section
      className={cn(
        "relative flex min-h-[70vh] w-full flex-col items-center justify-center px-4",
        hasCoverImage && "min-h-[70vh]"
      )}
    >
      {/* Cover image background - matches public event page */}
      {hasCoverImage && (
        <>
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${coverImageUrl})` }}
          />
          <div className="absolute inset-0 z-0 bg-black/50" />
        </>
      )}

      {/* Cover image upload overlay for editor */}
      {showCoverUpload && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-xl bg-background p-6">
            <h3 className="mb-4 font-semibold">Cover image</h3>
            <ImageUpload
              value={coverImageUrl}
              onChange={(url) => {
                onCoverImageChange(url);
                if (url) setShowCoverUpload(false);
              }}
              type="cover"
              className="aspect-video rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowCoverUpload(false)}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add/change cover button - visible in editor */}
      <button
        type="button"
        onClick={() => setShowCoverUpload(true)}
        className={cn(
          "absolute right-4 top-20 z-10 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
          hasCoverImage
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-muted/80 text-muted-foreground hover:bg-muted"
        )}
      >
        <ImagePlusIcon className="size-4" />
        {hasCoverImage ? "Change cover" : "Add cover"}
      </button>

      {/* Header - Back to dashboard instead of logo in editor */}
      <div className="absolute left-0 right-0 top-0 z-10">
        <EventPageHeader
          showRegistration={true}
          hasCoverImage={hasCoverImage}
          editorMode={true}
        />
      </div>

      {/* Main content - centered, WYSIWYG editable */}
      <div
        className={cn(
          "relative z-10 flex flex-col items-center justify-center text-center",
          hasCoverImage && "text-white [&_.text-muted-foreground]:text-white/80 [&_button]:text-white [&_button:hover]:bg-white/20"
        )}
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <InlineEditableText
            value={title}
            onChange={onTitleChange}
            placeholder="Event title"
            as="span"
            className="block"
          />
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          <InlineEditableText
            value={subtitle}
            onChange={onSubtitleChange}
            placeholder="Add a subtitle or tagline"
            as="span"
            className="block"
          />
        </p>
        <div className="mt-6 text-lg text-muted-foreground">
          <InlineEditableDateTime
            startsAt={startsAt}
            onStartsAtChange={onStartsAtChange}
            durationMinutes={durationMinutes}
            onDurationChange={onDurationChange}
          />
        </div>
      </div>
    </section>
  );
}
