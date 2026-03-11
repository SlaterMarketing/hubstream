"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/core";
import { createEvent, updateEvent, type RegistrationField } from "@/app/actions/events";
import { EventHeroEditor } from "./event-hero-editor";
import { EventContentEditor } from "./event-content-editor";
import { RegistrationFormBuilder } from "./registration-form-builder";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MediaItem = { type: "image" | "youtube"; url?: string; videoId?: string };

export type EventPageEditorProps = {
  event?: {
    id: string;
    title: string;
    subtitle?: string | null;
    description?: JSONContent | null;
    startsAt: Date;
    durationMinutes: number;
    timezone: string;
    coverImageUrl?: string | null;
    media?: MediaItem[] | null;
    registrationFields?: RegistrationField[] | null;
    eventSpeakers?: { speakerId: string; speaker: { id: string; name: string; bio?: string | null; imageUrl?: string | null;
      socialLinks?: unknown } }[];
  };
  mode: "create" | "edit";
};

const DEFAULT_REGISTRATION_FIELDS: RegistrationField[] = [
  { key: "firstName", label: "First name", type: "text", required: false },
  { key: "lastName", label: "Last name", type: "text", required: false },
  { key: "company", label: "Company", type: "text", required: false },
  { key: "jobTitle", label: "Job title", type: "text", required: false },
];

export function EventPageEditor({ event, mode }: EventPageEditorProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(event?.title ?? "");
  const [subtitle, setSubtitle] = useState(event?.subtitle ?? "");
  const [startsAt, setStartsAt] = useState(
    event?.startsAt
      ? new Date(event.startsAt).toISOString().slice(0, 16)
      : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [durationMinutes, setDurationMinutes] = useState(event?.durationMinutes ?? 60);
  const [timezone, setTimezone] = useState(event?.timezone ?? "UTC");
  const [description, setDescription] = useState<JSONContent | undefined>(
    (event?.description as JSONContent) ?? undefined
  );
  const [coverImageUrl, setCoverImageUrl] = useState(event?.coverImageUrl ?? "");
  const [media, setMedia] = useState<MediaItem[]>(event?.media ?? []);
  const [registrationFields, setRegistrationFields] = useState<RegistrationField[]>(
    (event?.registrationFields as RegistrationField[]) ?? DEFAULT_REGISTRATION_FIELDS
  );
  const [speakerIds, setSpeakerIds] = useState<string[]>(
    event?.eventSpeakers?.map((es) => es.speakerId) ?? []
  );

  async function handleSave() {
    setError("");
    setLoading(true);
    try {
      if (mode === "create") {
        const result = await createEvent({
          title,
          subtitle: subtitle || undefined,
          description,
          startsAt,
          durationMinutes,
          timezone,
          coverImageUrl: coverImageUrl || undefined,
          media: media.length ? media : undefined,
          registrationFields,
          speakerIds,
        });
        if (result.error) throw new Error(result.error);
        router.push(`/dashboard/events/${(result as { eventId: string }).eventId}`);
      } else if (event) {
        const result = await updateEvent(event.id, {
          title,
          subtitle: subtitle || undefined,
          description,
          startsAt,
          durationMinutes,
          timezone,
          coverImageUrl: coverImageUrl || undefined,
          media: media.length ? media : undefined,
          registrationFields,
          speakerIds,
        });
        if (result.error) throw new Error(result.error);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <EventHeroEditor
        title={title}
        subtitle={subtitle}
        startsAt={startsAt}
        durationMinutes={durationMinutes}
        timezone={timezone}
        coverImageUrl={coverImageUrl}
        onTitleChange={setTitle}
        onSubtitleChange={setSubtitle}
        onStartsAtChange={setStartsAt}
        onDurationChange={setDurationMinutes}
        onTimezoneChange={setTimezone}
        onCoverImageChange={setCoverImageUrl}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <EventContentEditor
            description={description}
            media={media}
            speakerIds={speakerIds}
            orgId={undefined}
            onDescriptionChange={setDescription}
            onMediaChange={setMedia}
            onSpeakerIdsChange={setSpeakerIds}
          />
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <RegistrationFormBuilder
            fields={registrationFields}
            onChange={setRegistrationFields}
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create event" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
