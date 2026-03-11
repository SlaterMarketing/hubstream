"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const LOGOS = [
  "Vuabl",
  "MailConnector",
  "Dinabite",
  "Advend",
  "Kintana",
  "Padwords",
  "CSVFixerAI",
  "Outvoice",
] as const;

function LogoItem({ name }: { name: string }) {
  return (
    <div
      className="shrink-0 text-lg font-semibold text-muted-foreground/60"
      style={{ fontVariantLigatures: "none" }}
    >
      {name}
    </div>
  );
}

export function SocialProof() {
  const t = useTranslations();
  return (
    <section className="bg-muted/30 py-8">
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
        <div className="overflow-hidden">
          <div className="flex w-max animate-scroll-right gap-12 sm:gap-16">
            {[...LOGOS, ...LOGOS].map((name, i) => (
              <LogoItem key={`${name}-${i}`} name={name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
