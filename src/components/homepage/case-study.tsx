"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { STATS } from "@/data/homepage";

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
    let start = 0;
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
          className="rounded-2xl border bg-gradient-to-br from-brand/10 to-orange-500/10 p-8 sm:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            {t("Homepage.caseStudy.title")}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {STATS.map((stat, index) => (
              <div key={stat.labelKey} className="text-center">
                <div className="text-4xl font-bold text-brand sm:text-5xl">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    inView={inView}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(stat.labelKey)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
