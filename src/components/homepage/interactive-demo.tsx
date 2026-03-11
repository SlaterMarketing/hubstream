"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function InteractiveDemo() {
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
            {t("Homepage.interactiveDemo.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("Homepage.interactiveDemo.subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-md"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="overflow-hidden rounded-xl border bg-card shadow-xl">
            <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-500/80" />
                <div className="size-2.5 rounded-full bg-yellow-500/80" />
                <div className="size-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-muted-foreground">
                events.yoursite.com/webinar-demo
              </span>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="text-sm font-medium">{t("Homepage.interactiveDemo.firstName")}</label>
                <Input className="mt-1" placeholder="Jane" disabled />
              </div>
              <div>
                <label className="text-sm font-medium">{t("Homepage.interactiveDemo.lastName")}</label>
                <Input className="mt-1" placeholder="Doe" disabled />
              </div>
              <div>
                <label className="text-sm font-medium">{t("Homepage.interactiveDemo.email")}</label>
                <Input className="mt-1" placeholder="jane@company.com" disabled />
              </div>
              <Button className="w-full" disabled>
                {t("Homepage.interactiveDemo.register")}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {t("Homepage.interactiveDemo.demoNote")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
