"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  PenLineIcon,
  Code2Icon,
  UsersIcon,
  ArrowRightIcon,
} from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "@/data/homepage";

const ICONS = {
  PenLine: PenLineIcon,
  Code2: Code2Icon,
  Users: UsersIcon,
} as const;

export function HowItWorks() {
  const t = useTranslations();
  return (
    <section id="how-it-works" className="scroll-mt-20 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("Homepage.howItWorks.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("Homepage.howItWorks.subtitle")}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = ICONS[step.icon];
            return (
              <motion.div
                key={step.id}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {index < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-1/2 translate-x-1/2 bg-border md:block" aria-hidden />
                )}
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand bg-brand/10 text-brand">
                  <Icon className="size-8" />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold">{t(step.titleKey)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(step.descriptionKey)}
                  </p>
                </div>
                {index < HOW_IT_WORKS_STEPS.length - 1 && (
                  <ArrowRightIcon className="mt-4 hidden size-5 text-muted-foreground md:block" aria-hidden />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
