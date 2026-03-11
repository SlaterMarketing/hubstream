"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon, PlayIcon, UsersIcon, BarChart3Icon, SettingsIcon, VideoIcon } from "lucide-react";
import type { Session } from "next-auth";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

type Props = {
  session: Session | null;
};

export function Hero({ session }: Props) {
  const t = useTranslations();
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:pt-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,114,76,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,114,76,0.1),transparent)]" />
      <motion.div
        className="mx-auto max-w-4xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          variants={itemVariants}
        >
          {t("Homepage.hero.headlineBefore")}{" "}
          <span className="inline-block">
            <span style={{ color: "#4285F4" }}>G</span>
            <span style={{ color: "#EA4335" }}>o</span>
            <span style={{ color: "#FBBC05" }}>o</span>
            <span style={{ color: "#4285F4" }}>g</span>
            <span style={{ color: "#34A853" }}>l</span>
            <span style={{ color: "#EA4335" }}>e</span>
            <span style={{ color: "#00AC47" }}> Meet</span>
          </span>{" "}
          <span className="text-foreground">{t("Homepage.hero.headlineAnd")}</span>{" "}
          <span style={{ color: "#FF7A59" }}>{t("Homepage.hero.headlineHubspot")}</span>
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          variants={itemVariants}
        >
          {t("Homepage.hero.subheadline")}
        </motion.p>
        <motion.div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" variants={itemVariants}>
          {session?.user ? (
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                {t("Homepage.hero.ctaDashboard")}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  {t("Homepage.hero.ctaPrimary")}
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  <PlayIcon className="mr-2 size-4" />
                  {t("Homepage.hero.ctaSecondary")}
                </Button>
              </a>
            </>
          )}
        </motion.div>
        <motion.p
          className="mt-6 text-sm text-muted-foreground"
          variants={itemVariants}
        >
          {t("Homepage.hero.trustLine")}
        </motion.p>
        <motion.div
          className="mx-auto mt-16 max-w-5xl"
          variants={itemVariants}
        >
          <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl shadow-black/10 dark:shadow-black/30 ring-1 ring-black/5 dark:ring-white/5">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-400/90" />
                <div className="size-2.5 rounded-full bg-amber-400/90" />
                <div className="size-2.5 rounded-full bg-emerald-400/90" />
              </div>
              <div className="flex-1 rounded-lg border border-border/60 bg-background/90 px-4 py-2 text-center text-xs text-muted-foreground shadow-inner">
                hubstream.app/dashboard
              </div>
            </div>
            {/* Dashboard layout */}
            <div className="flex min-h-[280px]">
              {/* Sidebar */}
              <div className="hidden w-48 shrink-0 border-r bg-muted/20 sm:block">
                <nav className="space-y-0.5 p-3">
                  {[
                    { icon: CalendarDaysIcon, label: "Events", active: true },
                    { icon: BarChart3Icon, label: "Analytics" },
                    { icon: SettingsIcon, label: "Settings" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                        item.active ? "bg-brand/10 font-medium text-brand" : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {item.label}
                    </div>
                  ))}
                </nav>
              </div>
              {/* Main content */}
              <div className="flex-1 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Upcoming events</h3>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    3 webinars
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { title: "Product Launch Webinar", date: "Mar 15, 2025", registrations: 47, status: "published" },
                    { title: "Q1 Strategy Review", date: "Mar 22, 2025", registrations: 23, status: "published" },
                    { title: "Customer Success Tips", date: "Apr 5, 2025", registrations: 8, status: "draft" },
                  ].map((event) => (
                    <div
                      key={event.title}
                      className="group rounded-lg border bg-background/50 p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 flex-1 gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                            <VideoIcon className="size-5 text-brand" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{event.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            event.status === "published"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-4 border-t border-border/50 pt-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <UsersIcon className="size-3.5" />
                          {event.registrations} registered
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
