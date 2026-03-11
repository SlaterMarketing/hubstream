"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { TESTIMONIALS } from "@/data/homepage";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const t = useTranslations();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
            {t("Homepage.testimonials.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("Homepage.testimonials.subtitle")}
          </p>
        </motion.div>

        <div className="relative mt-16">
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-2xl rounded-xl border bg-card p-8 shadow-sm"
              >
                <div className="flex gap-1 text-brand">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} className="size-5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-lg text-muted-foreground">
                  &ldquo;{t(TESTIMONIALS[active].quoteKey)}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {t(TESTIMONIALS[active].authorKey).charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">{t(TESTIMONIALS[active].authorKey)}</p>
                    <p className="text-sm text-muted-foreground">
                      {t(TESTIMONIALS[active].titleKey)} at {t(TESTIMONIALS[active].companyKey)}
                    </p>
                  </div>
                  <p className="ml-auto text-sm font-medium text-brand">
                    {t(TESTIMONIALS[active].metricKey)}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setActive((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="size-5" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "size-2 rounded-full transition-colors",
                    i === active ? "bg-brand" : "bg-muted-foreground/30"
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActive((p) => (p + 1) % TESTIMONIALS.length)}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
