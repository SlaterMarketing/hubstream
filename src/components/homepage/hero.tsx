"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon, PlayIcon } from "lucide-react";
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
          <span className="bg-gradient-to-r from-brand to-orange-500 bg-clip-text text-transparent">
            {t("Homepage.hero.headlineHighlight")}
          </span>{" "}
          {t("Homepage.hero.headlineAfter")}
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
          className="mx-auto mt-16 max-w-4xl"
          variants={itemVariants}
        >
          <div className="overflow-hidden rounded-xl border bg-card shadow-xl shadow-black/5 dark:shadow-black/20">
            <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-yellow-500/80" />
                <div className="size-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 rounded-md bg-background/80 px-3 py-1.5 text-center text-xs text-muted-foreground">
                app.hubstream.io/dashboard
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="size-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Webinar {i}</span>
                  </div>
                  <div className="mt-2 h-2 w-3/4 rounded bg-muted" />
                  <div className="mt-1 h-2 w-1/2 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
