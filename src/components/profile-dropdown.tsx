"use client";

import { useTheme } from "next-themes";
import { signOutAction } from "@/app/actions/auth";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import {
  CircleUserIcon,
  SunIcon,
  MoonIcon,
  PlusIcon,
  SettingsIcon,
  LogOutIcon,
  GlobeIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LOCALES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
] as const;

export function ProfileDropdown() {
  const t = useTranslations("Common");
  const tDashboard = useTranslations("Dashboard");
  const { setTheme } = useTheme();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm" className="gap-2">
          <CircleUserIcon className="size-4" />
          Profile
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Preferences</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <SunIcon className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <SunIcon className="mr-2 size-4" />
              {t("themeLight")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <MoonIcon className="mr-2 size-4" />
              {t("themeDark")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <span className="mr-2 size-4 text-center text-xs">◐</span>
              {t("themeSystem")}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <GlobeIcon className="mr-2 size-4" />
            {currentLocale.name}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {LOCALES.map((loc) => (
              <DropdownMenuItem
                key={loc.code}
                onClick={() => router.replace(pathname, { locale: loc.code })}
              >
                {loc.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/dashboard/events/new" className="flex cursor-default items-center gap-1.5">
            <PlusIcon className="size-4 shrink-0" />
            {tDashboard("newEvent")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/dashboard/settings" className="flex cursor-default items-center gap-1.5">
            <SettingsIcon className="size-4 shrink-0" />
            {tDashboard("settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <DropdownMenuItem>
            <button
              type="submit"
              className="flex w-full cursor-default items-center gap-1.5 border-0 bg-transparent px-0 py-0 text-left text-sm outline-none"
            >
              <LogOutIcon className="size-4 shrink-0" />
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
