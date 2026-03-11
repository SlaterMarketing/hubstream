"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Building2Icon, VideoIcon, CodeIcon, ArrowRightIcon } from "lucide-react";
import { INTEGRATIONS } from "@/data/homepage";

const ICONS = {
  Building2: Building2Icon,
  Video: VideoIcon,
  Code: CodeIcon,
} as const;

export function Integrations() {
  const t = useTranslations();
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("Homepage.integrations.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("Homepage.integrations.subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {INTEGRATIONS.map((integration, index) => {
            const Icon = ICONS[integration.icon];
            return (
              <div key={integration.id} className="flex items-center">
                <div className="flex flex-col items-center rounded-xl border bg-card p-6 shadow-sm md:w-44">
                  <div className="rounded-lg bg-muted p-3">
                    <Icon className="size-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 font-semibold">{t(integration.nameKey)}</h3>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    {t(integration.descriptionKey)}
                  </p>
                </div>
                {index < INTEGRATIONS.length - 1 && (
                  <ArrowRightIcon className="mx-2 hidden size-5 shrink-0 text-muted-foreground md:block" aria-hidden />
                )}
              </div>
            );
          })}
        </motion.div>

        <motion.p
          className="mt-8 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {t("Homepage.integrations.flow")}
        </motion.p>
      </div>
    </section>
  );
}
