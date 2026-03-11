"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MenuIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Session } from "next-auth";

const NAV_LINKS = [
  { href: "#features", labelKey: "Homepage.nav.features" },
  { href: "#pricing", labelKey: "Homepage.nav.pricing" },
  { href: "#faq", labelKey: "Homepage.nav.faq" },
] as const;

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (href.startsWith("#")) {
    e.preventDefault();
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }
}

type Props = {
  session: Session | null;
};

export function Navbar({ session }: Props) {
  const t = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(link.labelKey)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/privacy"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            {t("Homepage.nav.privacy")}
          </Link>
          {session?.user ? (
            <Link href="/dashboard">
              <Button>{t("Homepage.nav.dashboard")}</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button>{t("Auth.signInWithGoogle")}</Button>
            </Link>
          )}
          <button
            type="button"
            className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden border-t bg-background/95 backdrop-blur",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                scrollToSection(e, link.href);
                setMobileOpen(false);
              }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {t(link.labelKey)}
            </a>
          ))}
          <Link
            href="/privacy"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground sm:hidden"
            onClick={() => setMobileOpen(false)}
          >
            {t("Homepage.nav.privacy")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
