"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckIcon } from "lucide-react";
import { PRICING_PLANS, ALL_PLANS_INCLUDE } from "@/data/homepage";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";
import type { Session } from "next-auth";

type Props = {
  session: Session | null;
};

export function Pricing({ session }: Props) {
  const t = useTranslations();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="scroll-mt-20 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("Homepage.pricing.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("Homepage.pricing.subtitle")}
          </p>
          <Tabs
            value={billing}
            onValueChange={(v) => setBilling(v as "monthly" | "yearly")}
            className="mt-8 inline-flex"
          >
            <TabsList>
              <TabsTrigger value="monthly">{t("Homepage.pricing.monthly")}</TabsTrigger>
              <TabsTrigger value="yearly" className="relative">
                {t("Homepage.pricing.yearly")}
                <Badge variant="brand" className="ml-1.5 text-[10px]">
                  {t("Homepage.pricing.saveBadge")}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className={cn("h-full", !PRICING_PLANS.free.popular && "border-muted")}>
              <CardHeader>
                <CardTitle>{t(PRICING_PLANS.free.nameKey)}</CardTitle>
                <CardDescription>{t(PRICING_PLANS.free.descriptionKey)}</CardDescription>
                <p className="text-3xl font-bold">
                  $0
                  <span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-2 text-sm">
                  {PRICING_PLANS.free.features.map((key) => (
                    <li key={key} className="flex items-center gap-2">
                      <CheckIcon className="size-4 shrink-0 text-brand" />
                      {key === "Homepage.pricing.free.features.4" ? (
                        <span>
                          {t("Homepage.pricing.free.poweredBy")}{" "}
                          <BrandLogo showImage={false} size="sm" /> {t("Homepage.pricing.free.onEmbeds")}
                        </span>
                      ) : (
                        t(key)
                      )}
                    </li>
                  ))}
                </ul>
                {!session?.user && (
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      {t("Homepage.pricing.free.cta")}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className={cn("h-full", PRICING_PLANS.pro.popular && "border-brand bg-brand/5")}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>{t(PRICING_PLANS.pro.nameKey)}</CardTitle>
                  {PRICING_PLANS.pro.popular && (
                    <Badge variant="brand">{t("Homepage.pricing.mostPopular")}</Badge>
                  )}
                </div>
                <CardDescription>{t(PRICING_PLANS.pro.descriptionKey)}</CardDescription>
                <p className="text-3xl font-bold">
                  ${billing === "monthly" ? PRICING_PLANS.pro.priceMonthly : Math.floor(PRICING_PLANS.pro.priceYearly / 12)}
                  <span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
                {billing === "yearly" && (
                  <p className="text-sm text-muted-foreground">
                    {t("Homepage.pricing.billedYearly")} ${PRICING_PLANS.pro.priceYearly}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-2 text-sm">
                  {PRICING_PLANS.pro.features.map((key) => (
                    <li key={key} className="flex items-center gap-2">
                      <CheckIcon className="size-4 shrink-0 text-brand" />
                      {t(key)}
                    </li>
                  ))}
                </ul>
                {!session?.user && (
                  <Link href="/login">
                    <Button className="w-full">{t("Homepage.pricing.pro.cta")}</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 rounded-lg border bg-muted/30 p-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 text-center text-sm font-medium">
            {t("Homepage.pricing.allPlansTitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {ALL_PLANS_INCLUDE.map((key) => (
              <div key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckIcon className="size-4 shrink-0 text-brand" />
                {t(key)}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
