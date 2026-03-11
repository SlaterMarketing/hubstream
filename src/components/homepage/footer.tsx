"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";

const FOOTER_LINKS = {
  product: [
    { href: "#features", labelKey: "Homepage.nav.features" },
    { href: "#pricing", labelKey: "Homepage.nav.pricing" },
    { href: "#faq", labelKey: "Homepage.nav.faq" },
  ],
  resources: [
    { href: "/privacy", labelKey: "Homepage.footer.privacy" },
  ],
} as const;

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (href.startsWith("#")) {
    e.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }
}

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex">
              <BrandLogo />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {t("Homepage.footer.tagline")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold">{t("Homepage.footer.product")}</h4>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">{t("Homepage.footer.resources")}</h4>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            <BrandLogo showImage={false} size="sm" />
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
