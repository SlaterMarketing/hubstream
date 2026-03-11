"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

type Props = {
  content?: JSONContent | null;
  onChange?: (content: JSONContent) => void;
  placeholder?: string;
  className?: string;
};

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Write your event description...",
  className,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: content ?? undefined,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[150px] px-3 py-2 focus:outline-none",
      },
    },
  });

  return (
    <div
      className={`rounded-md border border-input bg-background ${className ?? ""}`}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
