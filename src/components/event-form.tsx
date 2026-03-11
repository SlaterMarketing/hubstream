"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TiptapEditor } from "@/components/tiptap-editor";
import { createEvent, updateEvent, publishEvent, cancelEvent, cloneEvent } from "@/app/actions/events";
import type { JSONContent } from "@tiptap/core";

type EventFormProps = {
  event?: {
    id: string;
    title: string;
    description?: JSONContent | Record<string, unknown> | null;
    startsAt: Date;
    durationMinutes: number;
    timezone: string;
    speakers: string | null;
    status: string;
    meetLink: string | null;
    recordingUrl: string | null;
  };
  mode: "create" | "edit";
};

export function EventForm({ event, mode }: EventFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const defaultDate = event
    ? new Date(event.startsAt).toISOString().slice(0, 16)
    : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [description, setDescription] = useState<JSONContent | undefined>(
    event?.description ?? undefined
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      description,
      startsAt: (form.elements.namedItem("startsAt") as HTMLInputElement).value,
      durationMinutes: parseInt(
        (form.elements.namedItem("durationMinutes") as HTMLInputElement).value,
        10
      ),
      timezone: (form.elements.namedItem("timezone") as HTMLInputElement).value || "UTC",
      speakers: (form.elements.namedItem("speakers") as HTMLInputElement).value,
    };

    try {
      if (mode === "create") {
        const result = await createEvent(data);
        if (result.error) throw new Error(result.error);
        router.push(`/dashboard/events/${(result as { eventId: string }).eventId}`);
      } else if (event) {
        const result = await updateEvent(event.id, data);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          name="title"
          defaultValue={event?.title}
          required
          placeholder="Webinar: Introduction to..."
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <div className="mt-1">
          <TiptapEditor
            content={description}
            onChange={setDescription}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startsAt" className="text-sm font-medium">
            Start date & time
          </label>
          <Input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={defaultDate}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="durationMinutes" className="text-sm font-medium">
            Duration (minutes)
          </label>
          <Input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min={15}
            max={480}
            defaultValue={event?.durationMinutes ?? 60}
            required
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <label htmlFor="timezone" className="text-sm font-medium">
          Timezone
        </label>
        <Input
          id="timezone"
          name="timezone"
          defaultValue={event?.timezone ?? "UTC"}
          placeholder="UTC"
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="speakers" className="text-sm font-medium">
          Speakers (optional)
        </label>
        <Input
          id="speakers"
          name="speakers"
          defaultValue={event?.speakers ?? ""}
          placeholder="John Doe, Jane Smith"
          className="mt-1"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create event" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

type EventActionsProps = {
  event: {
    id: string;
    status: string;
    meetLink: string | null;
  };
};

export function EventActions({ event }: EventActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handlePublish() {
    setLoading("publish");
    setError("");
    const result = await publishEvent(event.id);
    if (result.error) setError(result.error);
    else router.refresh();
    setLoading(null);
  }

  async function handleCancel() {
    if (!confirm("Cancel this event? All registrants will need to be notified separately.")) return;
    setLoading("cancel");
    setError("");
    const result = await cancelEvent(event.id);
    if (result.error) setError(result.error);
    else router.push("/dashboard");
    setLoading(null);
  }

  async function handleClone() {
    setLoading("clone");
    setError("");
    const result = await cloneEvent(event.id);
    if (result.error) setError(result.error);
    else router.push(`/dashboard/events/${(result as { eventId: string }).eventId}`);
    setLoading(null);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {event.status === "draft" && (
        <Button onClick={handlePublish} disabled={!!loading}>
          {loading === "publish" ? "Publishing..." : "Publish"}
        </Button>
      )}
      {event.status === "published" && event.meetLink && (
        <a
          href={event.meetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent"
        >
          Open Meet link
        </a>
      )}
      {(event.status === "draft" || event.status === "published") && (
        <Button variant="outline" onClick={handleClone} disabled={!!loading}>
          {loading === "clone" ? "Cloning..." : "Duplicate"}
        </Button>
      )}
      {(event.status === "draft" || event.status === "published") && (
        <Button variant="destructive" onClick={handleCancel} disabled={!!loading}>
          {loading === "cancel" ? "Cancelling..." : "Cancel event"}
        </Button>
      )}
      {error && <p className="text-sm text-destructive w-full">{error}</p>}
    </div>
  );
}
