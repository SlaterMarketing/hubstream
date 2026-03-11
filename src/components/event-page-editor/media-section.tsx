"use client";

import { useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "./image-upload";
import type { MediaItem } from "./event-page-editor";

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

type Props = {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
};

export function MediaSection({ media, onChange }: Props) {
  const [youtubeUrl, setYoutubeUrl] = useState("");

  function addImage(url: string) {
    if (url) onChange([...media, { type: "image", url }]);
  }

  function addYouTube() {
    const videoId = extractYouTubeId(youtubeUrl);
    if (videoId) {
      onChange([...media, { type: "youtube", videoId, url: `https://www.youtube.com/watch?v=${videoId}` }]);
      setYoutubeUrl("");
    }
  }

  function removeAt(index: number) {
    onChange(media.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {media.map((item, index) => (
        <div key={index} className="relative">
          {item.type === "image" && item.url ? (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <img src={item.url} alt="" className="h-full w-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => removeAt(index)}
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          ) : item.type === "youtube" && item.videoId ? (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <iframe
                src={`https://www.youtube.com/embed/${item.videoId}`}
                title="YouTube"
                className="h-full w-full"
                allowFullScreen
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => removeAt(index)}
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          ) : null}
        </div>
      ))}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <ImageUpload
            value=""
            onChange={addImage}
            type="event"
            className="min-h-[80px]"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Input
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addYouTube}
            disabled={!extractYouTubeId(youtubeUrl)}
          >
            <PlusIcon className="mr-2 size-4" />
            Add YouTube
          </Button>
        </div>
      </div>
    </div>
  );
}
