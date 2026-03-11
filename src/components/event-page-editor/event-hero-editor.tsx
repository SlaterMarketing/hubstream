"use client";

import { Input } from "@/components/ui/input";
import { ImageUpload } from "./image-upload";

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
  onTimezoneChange,
  onCoverImageChange,
}: Props) {
  return (
    <div className="space-y-6 rounded-xl bg-card p-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Cover image</label>
        <ImageUpload
          value={coverImageUrl}
          onChange={onCoverImageChange}
          type="cover"
          className="aspect-video rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Title</label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Webinar: Introduction to..."
          className="text-2xl font-bold"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Sub-heading</label>
        <Input
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          placeholder="A brief tagline for your event"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Date & time</label>
          <Input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => onStartsAtChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Duration (min)</label>
          <Input
            type="number"
            min={15}
            max={480}
            value={durationMinutes}
            onChange={(e) => onDurationChange(parseInt(e.target.value, 10) || 60)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Timezone</label>
        <Input
          value={timezone}
          onChange={(e) => onTimezoneChange(e.target.value)}
          placeholder="UTC"
        />
      </div>
    </div>
  );
}
