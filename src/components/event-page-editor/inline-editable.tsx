"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type InlineEditableTextProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  as?: "h1" | "p" | "span";
};

export function InlineEditableText({
  value,
  onChange,
  placeholder = "Click to edit",
  className,
  as: Tag = "span",
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    const trimmed = editValue.trim();
    if (trimmed !== value) onChange(trimmed || placeholder);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") {
            setEditValue(value);
            setIsEditing(false);
          }
        }}
        className={cn(
          "w-full min-w-0 bg-transparent text-inherit font-inherit outline-none border-b border-dashed border-muted-foreground/50 focus:border-foreground",
          className
        )}
        style={{ font: "inherit" }}
      />
    );
  }

  return (
    <Tag
      onClick={() => setIsEditing(true)}
      className={cn(
        "cursor-text rounded px-0.5 -mx-0.5 hover:bg-muted/50 transition-colors",
        (!value || value === placeholder) && "text-muted-foreground italic",
        className
      )}
    >
      {value || placeholder}
    </Tag>
  );
}

type InlineEditableDateTimeProps = {
  startsAt: string; // datetime-local format
  onStartsAtChange: (v: string) => void;
  durationMinutes: number;
  onDurationChange: (v: number) => void;
  timezone?: string;
  className?: string;
};

export function InlineEditableDateTime({
  startsAt,
  onStartsAtChange,
  durationMinutes,
  onDurationChange,
  className,
}: InlineEditableDateTimeProps) {
  const [editingPart, setEditingPart] = useState<"date" | "time" | "duration" | null>(null);
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [durationValue, setDurationValue] = useState(String(durationMinutes));

  const d = startsAt ? new Date(startsAt) : new Date();
  const formattedDate = d.toLocaleDateString(undefined, { dateStyle: "full" });
  const formattedTime = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  useEffect(() => {
    if (startsAt) {
      const d = new Date(startsAt);
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      const h = d.getHours().toString().padStart(2, "0");
      const min = d.getMinutes().toString().padStart(2, "0");
      setDateValue(`${y}-${m}-${day}`);
      setTimeValue(`${h}:${min}`);
    }
  }, [startsAt]);

  useEffect(() => {
    setDurationValue(String(durationMinutes));
  }, [durationMinutes]);

  const handleDateSave = () => {
    if (dateValue && timeValue) {
      onStartsAtChange(`${dateValue}T${timeValue}:00`);
    }
    setEditingPart(null);
  };

  const handleTimeSave = () => {
    if (dateValue && timeValue) {
      onStartsAtChange(`${dateValue}T${timeValue}:00`);
    }
    setEditingPart(null);
  };

  const handleDurationSave = () => {
    const n = parseInt(durationValue, 10);
    if (!isNaN(n) && n >= 15 && n <= 480) {
      onDurationChange(n);
    }
    setEditingPart(null);
  };

  return (
    <p className={cn("flex flex-wrap items-center justify-center gap-x-1", className)}>
      {editingPart === "date" ? (
        <input
          type="date"
          value={dateValue}
          onChange={(e) => setDateValue(e.target.value)}
          onBlur={handleDateSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleDateSave();
            if (e.key === "Escape") setEditingPart(null);
          }}
          autoFocus
          className="rounded border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditingPart("date")}
          className="cursor-text rounded px-1 -mx-1 hover:bg-muted/50 transition-colors text-inherit"
        >
          {formattedDate}
        </button>
      )}
      <span> at </span>
      {editingPart === "time" ? (
        <input
          type="time"
          value={timeValue}
          onChange={(e) => setTimeValue(e.target.value)}
          onBlur={handleTimeSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleTimeSave();
            if (e.key === "Escape") setEditingPart(null);
          }}
          autoFocus
          className="rounded border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditingPart("time")}
          className="cursor-text rounded px-1 -mx-1 hover:bg-muted/50 transition-colors text-inherit"
        >
          {formattedTime}
        </button>
      )}
      <span> • </span>
      {editingPart === "duration" ? (
        <span className="inline-flex items-center gap-1">
          <input
            type="number"
            min={15}
            max={480}
            value={durationValue}
            onChange={(e) => setDurationValue(e.target.value)}
            onBlur={handleDurationSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleDurationSave();
              if (e.key === "Escape") setEditingPart(null);
            }}
            autoFocus
            className="w-14 rounded border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <span>min</span>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setEditingPart("duration")}
          className="cursor-text rounded px-1 -mx-1 hover:bg-muted/50 transition-colors text-inherit"
        >
          {durationMinutes} min
        </button>
      )}
    </p>
  );
}
