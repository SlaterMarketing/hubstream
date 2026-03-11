"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  VideoIcon,
  RefreshCwIcon,
  CodeIcon,
  FormInputIcon,
  GlobeIcon,
  UsersIcon,
} from "lucide-react";
import { FEATURES } from "@/data/homepage";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ICONS = {
  Video: VideoIcon,
  RefreshCw: RefreshCwIcon,
  Code: CodeIcon,
  FormInput: FormInputIcon,
  Globe: GlobeIcon,
  Users: UsersIcon,
} as const;

export function Features() {
  const t = useTranslations();
  return (
    <section id="features" className="scroll-mt-20 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("Homepage.features.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("Homepage.features.subtitle")}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = ICONS[feature.icon];
            return (
              <motion.div
                key={feature.id}
                className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-brand/10 p-2.5 text-brand">
                    <Icon className="size-5" />
                  </div>
                  {feature.pro && (
                    <Badge variant="brand" className="text-xs">
                      {t("Homepage.features.proBadge")}
                    </Badge>
                  )}
                </div>
                <h3 className="mt-4 font-semibold">{t(feature.titleKey)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(feature.descriptionKey)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
