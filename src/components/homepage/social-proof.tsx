"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const LOGOS = [
  "Google",
  "HubSpot",
  "Stripe",
  "Vercel",
  "Notion",
  "Figma",
] as const;

export function SocialProof() {
  const t = useTranslations();
  return (
    <section className="border-y bg-muted/30 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <motion.p
          className="mb-6 text-center text-sm font-medium text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {t("Homepage.socialProof.trustedBy")}
        </motion.p>
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {LOGOS.map((name) => (
            <div
              key={name}
              className="text-lg font-semibold text-muted-foreground/60 grayscale transition-colors hover:text-muted-foreground hover:grayscale-0"
            >
              {name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
