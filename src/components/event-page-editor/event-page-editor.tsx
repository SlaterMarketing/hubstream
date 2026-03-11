"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/core";
import { updateEvent, publishEvent, type RegistrationField } from "@/app/actions/events";
import { useEventEditorActions } from "@/components/dashboard-header";
import { EventHeroEditor } from "./event-hero-editor";
import { EventContentEditor } from "./event-content-editor";
import { RegistrationFormBuilder } from "./registration-form-builder";

export type MediaItem = { type: "image" | "youtube"; url?: string; videoId?: string };

export type EventPageEditorProps = {
  event?: {
    id: string;
    status?: string;
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

const AUTO_SAVE_DEBOUNCE_MS = 800;

export function EventPageEditor({ event, mode }: EventPageEditorProps) {
  const router = useRouter();
  const ctx = useEventEditorActions();
  const [error, setError] = useState("");
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const performSave = useCallback(async () => {
    if (!event?.id) return;
    setError("");
    try {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }, [
    event?.id,
    title,
    subtitle,
    description,
    startsAt,
    durationMinutes,
    timezone,
    coverImageUrl,
    media,
    registrationFields,
    speakerIds,
    router,
  ]);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (mode !== "edit" || !event?.id) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      performSave();
      saveTimeoutRef.current = null;
    }, AUTO_SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [
    mode,
    event?.id,
    performSave,
    title,
    subtitle,
    description,
    startsAt,
    durationMinutes,
    timezone,
    coverImageUrl,
    media,
    registrationFields,
    speakerIds,
  ]);

  const handlePublish = useCallback(async () => {
    if (!event?.id) return;
    const result = await publishEvent(event.id);
    if (result.error) setError(result.error);
    else router.refresh();
  }, [event?.id, router]);

  useEffect(() => {
    if (!ctx) return;
    const canPublish = !!event?.id && event.status === "draft";
    ctx.setCanPublish(canPublish);
    ctx.actionsRef.current = { save: performSave, publish: handlePublish };
    return () => {
      ctx.actionsRef.current = null;
      ctx.setCanPublish(false);
    };
  }, [ctx, event?.id, event?.status, performSave, handlePublish]);

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
    </div>
  );
}
