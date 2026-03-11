"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { VideoIcon, UsersIcon, ZapIcon } from "lucide-react";
import { STATS } from "@/data/homepage";

const STAT_ICONS = [VideoIcon, UsersIcon, ZapIcon] as const;

function AnimatedCounter({
  value,
  suffix,
  duration = 2,
  inView,
}: {
  value: number;
  suffix: string;
  duration?: number;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const end = value;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 2;
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, [value, duration, inView]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function CaseStudy() {
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-brand/5 via-background to-orange-500/5 p-8 shadow-xl shadow-black/5 dark:shadow-black/20 sm:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Subtle grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              {t("Homepage.caseStudy.title")}
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {STATS.map((stat, index) => {
                const Icon = STAT_ICONS[index];
                return (
                  <motion.div
                    key={stat.labelKey}
                    className="group relative rounded-xl border border-border/60 bg-background/60 p-6 backdrop-blur-sm transition-all hover:border-brand/30 hover:bg-background/80 hover:shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-center">
                      <div className="rounded-xl bg-brand/10 p-3 text-brand transition-colors group-hover:bg-brand/20">
                        <Icon className="size-6" />
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="text-4xl font-bold text-brand sm:text-5xl">
                        <AnimatedCounter
                          value={stat.value}
                          suffix={stat.suffix}
                          inView={inView}
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium text-muted-foreground">
                        {t(stat.labelKey)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mini testimonial */}
            <motion.div
              className="mt-10 border-t border-border/60 pt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-center text-sm italic text-muted-foreground">
                &ldquo;We cut our webinar setup from hours to minutes. The HubSpot sync alone is worth it.&rdquo;
              </p>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                — Marketing team, B2B SaaS company
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
