"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";

type Props = {
  showRegistration: boolean;
  hasCoverImage: boolean;
};

export function EventPageHeader({ showRegistration, hasCoverImage }: Props) {
  const t = useTranslations("EventPage");

  const scrollToRegister = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  const textClass = hasCoverImage ? "text-white" : "text-foreground";

  return (
    <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 py-4 sm:px-6">
      <Link href="/" className={`flex items-center ${textClass} hover:opacity-90`}>
        <BrandLogo showImage size="md" inverted={hasCoverImage} />
      </Link>
      {showRegistration && (
        <Button
          onClick={scrollToRegister}
          variant={hasCoverImage ? "secondary" : "default"}
          className={hasCoverImage ? "bg-white/90 text-foreground hover:bg-white" : ""}
        >
          {t("registerForEvent")}
        </Button>
      )}
    </header>
  );
}
