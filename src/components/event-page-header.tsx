"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { useEventEditorActions } from "@/components/dashboard-header";

type Props = {
  showRegistration: boolean;
  hasCoverImage: boolean;
  /** When true, show "Back to dashboard" + "Publish event" instead of logo + "Register" (for draft/editor view) */
  editorMode?: boolean;
  /** When set (e.g. editing published event), show "Back to event" with this href instead of "Back to dashboard" */
  backHref?: string;
};

export function EventPageHeader({ showRegistration, hasCoverImage, editorMode, backHref }: Props) {
  const t = useTranslations("EventPage");
  const ctx = useEventEditorActions();

  const scrollToRegister = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePublish = useCallback(async () => {
    const actions = ctx?.actionsRef?.current;
    if (actions?.publish) {
      ctx?.setIsPublishing(true);
      try {
        await actions.publish();
      } finally {
        ctx?.setIsPublishing(false);
      }
    }
  }, [ctx]);

  const textClass = hasCoverImage ? "text-white" : "text-foreground";
  const canPublish = ctx?.canPublish ?? false;
  const isPublishing = ctx?.isPublishing ?? false;

  return (
    <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 py-4 sm:px-6">
      {editorMode ? (
        <Link
          href={backHref ?? "/dashboard"}
          className={`text-sm font-medium ${textClass} hover:opacity-90 transition-colors`}
        >
          ← {backHref ? "Back to event" : "Back to dashboard"}
        </Link>
      ) : (
        <Link href="/" className={`flex items-center ${textClass} hover:opacity-90`}>
          <BrandLogo showImage size="md" inverted={hasCoverImage} />
        </Link>
      )}
      {editorMode ? (
        backHref ? (
          <Link
            href={backHref}
            className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              hasCoverImage
                ? "bg-white/90 text-foreground hover:bg-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            Done
          </Link>
        ) : (
          <Button
            onClick={handlePublish}
            disabled={!canPublish || isPublishing}
            variant={hasCoverImage ? "secondary" : "default"}
            className={hasCoverImage ? "bg-white/90 text-foreground hover:bg-white" : ""}
          >
            {isPublishing ? "Publishing..." : "Publish event"}
          </Button>
        )
      ) : (
        showRegistration && (
          <Button
            onClick={scrollToRegister}
            variant={hasCoverImage ? "secondary" : "default"}
            className={hasCoverImage ? "bg-white/90 text-foreground hover:bg-white" : ""}
          >
            {t("registerForEvent")}
          </Button>
        )
      )}
    </header>
  );
}
