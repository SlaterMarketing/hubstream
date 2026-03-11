import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import type { JSONContent } from "@tiptap/core";

type Props = {
  content: JSONContent | Record<string, unknown> | unknown | null | undefined;
  className?: string;
};

export function TiptapRenderer({ content, className }: Props) {
  if (!content) return null;

  const html = generateHTML(content as JSONContent, [
    StarterKit,
    Link.configure({ openOnClick: false }),
    Image,
  ]);

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
