"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  const t = useTranslations();
  return (
    <section className="px-4 py-24">
      <motion.div
        className="mx-auto w-[80%] rounded-2xl bg-gradient-to-br from-brand to-orange-500 px-8 py-16 text-center text-white shadow-xl sm:px-16 sm:py-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("Homepage.finalCta.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/90">
          {t("Homepage.finalCta.subtitle")}
        </p>
        <Link href="/login" className="mt-8 inline-block">
          <Button
            size="lg"
            className="bg-white text-brand hover:bg-white/90 hover:text-brand"
          >
            {t("Homepage.finalCta.cta")}
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
