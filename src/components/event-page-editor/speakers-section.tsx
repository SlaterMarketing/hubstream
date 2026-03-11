"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PlusIcon, Trash2Icon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listOrgSpeakers, createSpeaker } from "@/app/actions/speakers";
import { ImageUpload } from "./image-upload";
import { cn } from "@/lib/utils";

type Speaker = {
  id: string;
  name: string;
  bio?: string | null;
  imageUrl?: string | null;
  socialLinks?: unknown;
};

type Props = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export function SpeakersSection({ selectedIds, onChange }: Props) {
  const t = useTranslations("EventEditor");
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newSocialLinks, setNewSocialLinks] = useState({ twitter: "", linkedin: "", website: "" });

  useEffect(() => {
    listOrgSpeakers().then((res) => {
      if ("speakers" in res) setSpeakers(res.speakers as Speaker[]);
    });
  }, []);

  const selectedSpeakers = selectedIds
    .map((id) => speakers.find((s) => s.id === id))
    .filter(Boolean) as Speaker[];

  function toggleSpeaker(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  async function handleCreateSpeaker() {
    if (!newName.trim()) return;
    const result = await createSpeaker({
      name: newName.trim(),
      bio: newBio.trim() || undefined,
      imageUrl: newImageUrl.trim() || undefined,
      socialLinks:
        newSocialLinks.twitter || newSocialLinks.linkedin || newSocialLinks.website
          ? {
              twitter: newSocialLinks.twitter || undefined,
              linkedin: newSocialLinks.linkedin || undefined,
              website: newSocialLinks.website || undefined,
            }
          : undefined,
    });
    if ("speaker" in result && result.speaker) {
      setSpeakers((prev) => [...prev, result.speaker]);
      onChange([...selectedIds, result.speaker.id]);
      setCreating(false);
      setNewName("");
      setNewBio("");
      setNewImageUrl("");
      setNewSocialLinks({ twitter: "", linkedin: "", website: "" });
    }
  }

  function moveSpeaker(id: string, direction: "up" | "down") {
    const idx = selectedIds.indexOf(id);
    if (idx < 0) return;
    const next = [...selectedIds];
    const swap = direction === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange(next);
  }

  function removeFromEvent(id: string) {
    onChange(selectedIds.filter((i) => i !== id));
  }

  return (
    <div className="space-y-4">
      {selectedSpeakers.map((speaker, index) => (
        <div
          key={speaker.id}
          className="flex items-center gap-4 rounded-lg p-4"
        >
          {speaker.imageUrl ? (
            <img
              src={speaker.imageUrl}
              alt={speaker.name}
              className="size-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <UserIcon className="size-6 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-medium">{speaker.name}</p>
            {speaker.bio && (
              <p className="truncate text-sm text-muted-foreground">{speaker.bio}</p>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => moveSpeaker(speaker.id, "up")}
              disabled={index === 0}
            >
              ↑
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => moveSpeaker(speaker.id, "down")}
              disabled={index === selectedSpeakers.length - 1}
            >
              ↓
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeFromEvent(speaker.id)}
            >
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        </div>
      ))}

      <div className="space-y-3">
        {speakers
          .filter((s) => !selectedIds.includes(s.id))
          .map((speaker) => (
            <button
              key={speaker.id}
              type="button"
              onClick={() => toggleSpeaker(speaker.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-lg p-3 text-left transition-colors hover:bg-muted/50"
              )}
            >
              {speaker.imageUrl ? (
                <img
                  src={speaker.imageUrl}
                  alt={speaker.name}
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <UserIcon className="size-5 text-muted-foreground" />
                </div>
              )}
              <span className="font-medium">{speaker.name}</span>
              <PlusIcon className="ml-auto size-4 text-muted-foreground" />
            </button>
          ))}

        {creating ? (
          <div className="space-y-4 rounded-lg p-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
            />
            <Input
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder="Bio"
            />
            <ImageUpload
              value={newImageUrl}
              onChange={setNewImageUrl}
              type="speaker"
            />
            <div className="grid gap-2 sm:grid-cols-3">
              <Input
                value={newSocialLinks.twitter}
                onChange={(e) =>
                  setNewSocialLinks((p) => ({ ...p, twitter: e.target.value }))
                }
                placeholder="Twitter"
              />
              <Input
                value={newSocialLinks.linkedin}
                onChange={(e) =>
                  setNewSocialLinks((p) => ({ ...p, linkedin: e.target.value }))
                }
                placeholder="LinkedIn"
              />
              <Input
                value={newSocialLinks.website}
                onChange={(e) =>
                  setNewSocialLinks((p) => ({ ...p, website: e.target.value }))
                }
                placeholder="Website"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateSpeaker}>
                Save & add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCreating(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setCreating(true)}
          >
            <PlusIcon className="mr-2 size-4" />
            {t("createSpeaker")}
          </Button>
        )}
      </div>
    </div>
  );
}
