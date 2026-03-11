"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  PenLineIcon,
  Code2Icon,
  UsersIcon,
  AlignLeftIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "@/data/homepage";
import { cn } from "@/lib/utils";

const ICONS = {
  PenLine: PenLineIcon,
  Code2: Code2Icon,
  Users: UsersIcon,
} as const;

export function HowItWorks() {
  const t = useTranslations();
  const [activeStep, setActiveStep] = useState<"create" | "embed" | "engage">("create");

  return (
    <section id="how-it-works" className="scroll-mt-20 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("Homepage.howItWorks.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("Homepage.howItWorks.subtitle")}
          </p>
        </motion.div>

        {/* Step selector */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {HOW_IT_WORKS_STEPS.map((step) => {
            const Icon = ICONS[step.icon];
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id as "create" | "embed" | "engage")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-6 py-4 transition-all",
                  isActive
                    ? "border-brand bg-brand/10 text-brand shadow-md"
                    : "border-border bg-card hover:border-brand/50 hover:bg-muted/50"
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2",
                    isActive ? "border-brand bg-brand/20" : "border-border bg-muted/50"
                  )}
                >
                  <Icon className="size-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">{t(step.titleKey)}</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {t(step.descriptionKey)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live dashboard preview */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl shadow-black/10 dark:shadow-black/30 ring-1 ring-black/5 dark:ring-white/5">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-400/90" />
                <div className="size-2.5 rounded-full bg-amber-400/90" />
                <div className="size-2.5 rounded-full bg-emerald-400/90" />
              </div>
              <div className="flex-1 rounded-lg border border-border/60 bg-background/90 px-4 py-2 text-center text-xs text-muted-foreground shadow-inner">
                app.hubstream.io/dashboard
                {activeStep === "create" && "/events/new"}
                {activeStep === "embed" && "/events/abc123"}
                {activeStep === "engage" && "/events/abc123"}
              </div>
            </div>

            <div className="min-h-[320px] bg-background">
              <AnimatePresence mode="wait">
                {activeStep === "create" && (
                  <CreatePreview key="create" />
                )}
                {activeStep === "embed" && (
                  <EmbedPreview key="embed" />
                )}
                {activeStep === "engage" && (
                  <EngagePreview key="engage" />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CreatePreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold">Create new event</h3>
        <p className="text-sm text-muted-foreground">
          Create a draft, then publish to generate a Google Meet link
        </p>
      </div>
      <div className="space-y-4 rounded-lg border bg-card p-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Title</label>
          <div className="mt-1 h-9 rounded-md border bg-muted/30 px-3 py-2 text-sm">
            Product Launch Webinar
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Description</label>
          <div className="mt-1 flex min-h-[80px] items-center gap-2 rounded-md border bg-muted/30 p-3">
            <AlignLeftIcon className="size-4 shrink-0 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <div className="h-2 w-full rounded bg-muted" />
              <div className="h-2 w-4/5 rounded bg-muted" />
              <div className="h-2 w-3/5 rounded bg-muted" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Date & time</label>
            <div className="mt-1 h-9 rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
              Mar 15, 2025, 2:00 PM
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Duration</label>
            <div className="mt-1 h-9 rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
              60 min
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <div className="h-9 w-24 rounded-md bg-brand/80" />
        </div>
      </div>
    </motion.div>
  );
}

function EmbedPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold">Public event page</h3>
        <p className="text-sm text-muted-foreground">
          Share this link or embed the form on your website
        </p>
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="break-all text-xs text-muted-foreground">
            https://yourapp.com/en/your-org/product-launch-webinar
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="mb-3 text-xs font-medium text-muted-foreground">
            Copy this code to embed the registration form:
          </p>
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-[10px]">
            <code>{`<iframe src="https://hubstream.app/embed/..." width="100%" height="400"></iframe>`}</code>
          </pre>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex h-8 items-center gap-2 rounded-md border px-3 text-xs">
              <CopyIcon className="size-3.5" />
              Copy embed code
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EngagePreview() {
  const registrations = [
    { email: "sarah@acme.com", name: "Sarah Chen", company: "Acme Inc", date: "Mar 10, 2:34 PM" },
    { email: "mike@tech.co", name: "Mike Johnson", company: "TechCo", date: "Mar 9, 11:20 AM" },
    { email: "jane@startup.io", name: "Jane Doe", company: "Startup", date: "Mar 8, 4:15 PM" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Registrations</h3>
          <p className="text-sm text-muted-foreground">
            3 confirmed registrants • Synced to HubSpot
          </p>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-md border bg-muted/50" />
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-2 text-left font-medium">Email</th>
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="hidden px-4 py-2 text-left font-medium sm:table-cell">Company</th>
              <th className="px-4 py-2 text-left font-medium">Registered</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.email} className="border-b last:border-0">
                <td className="px-4 py-2">{r.email}</td>
                <td className="px-4 py-2">{r.name}</td>
                <td className="hidden px-4 py-2 sm:table-cell">{r.company}</td>
                <td className="px-4 py-2 text-muted-foreground">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <CheckIcon className="size-3.5 text-emerald-500" />
        Google Meet link sent to attendees
      </p>
    </motion.div>
  );
}
