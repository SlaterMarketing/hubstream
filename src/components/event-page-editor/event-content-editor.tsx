"use client";

import { useTranslations } from "next-intl";
import type { JSONContent } from "@tiptap/core";
import { TiptapEditor } from "@/components/tiptap-editor";
import { ImageUpload } from "./image-upload";
import { SpeakersSection } from "./speakers-section";
import { MediaSection } from "./media-section";
import type { MediaItem } from "./event-page-editor";

type Props = {
  description?: JSONContent;
  media: MediaItem[];
  speakerIds: string[];
  orgId?: string;
  onDescriptionChange: (v: JSONContent) => void;
  onMediaChange: (v: MediaItem[]) => void;
  onSpeakerIdsChange: (v: string[]) => void;
};

export function EventContentEditor({
  description,
  media,
  speakerIds,
  onDescriptionChange,
  onMediaChange,
  onSpeakerIdsChange,
}: Props) {
  const t = useTranslations("EventEditor");

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-6">
        <h3 className="mb-4 font-semibold">{t("description")}</h3>
        <TiptapEditor
          content={description}
          onChange={onDescriptionChange}
          placeholder="Write your event description..."
        />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h3 className="mb-4 font-semibold">{t("media")}</h3>
        <MediaSection media={media} onChange={onMediaChange} />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h3 className="mb-4 font-semibold">{t("speakers")}</h3>
        <SpeakersSection
          selectedIds={speakerIds}
          onChange={onSpeakerIdsChange}
        />
      </div>
    </div>
  );
}
