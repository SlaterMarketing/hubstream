"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Building2Icon,
  VideoIcon,
  CodeIcon,
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { INTEGRATIONS } from "@/data/homepage";
import { cn } from "@/lib/utils";

const ICONS = {
  Building2: Building2Icon,
  Video: VideoIcon,
  Code: CodeIcon,
} as const;

type IntegrationId = (typeof INTEGRATIONS)[number]["id"];

const FLOW_STEPS = ["Registration", "HubSpot Contact", "Google Meet Link", "Attendee"] as const;

export function Integrations() {
  const t = useTranslations();
  const [activeIntegration, setActiveIntegration] = useState<IntegrationId>("hubspot");

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
            {t("Homepage.integrations.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("Homepage.integrations.subtitle")}
          </p>
        </motion.div>

        {/* Integration cards - clickable */}
        <div className="mt-12 flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-4">
          {INTEGRATIONS.map((integration, index) => {
            const Icon = ICONS[integration.icon];
            const isActive = activeIntegration === integration.id;
            return (
              <div key={integration.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveIntegration(integration.id)}
                  className={cn(
                    "flex w-full flex-col items-center rounded-xl border p-6 shadow-sm transition-all md:w-48",
                    isActive
                      ? "border-brand bg-brand/5 ring-2 ring-brand/20"
                      : "border-border bg-card hover:border-brand/50 hover:shadow-md"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg p-3",
                      isActive ? "bg-brand/20" : "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-8",
                        isActive ? "text-brand" : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <h3 className="mt-4 font-semibold">{t(integration.nameKey)}</h3>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    {t(integration.descriptionKey)}
                  </p>
                </button>
                {index < INTEGRATIONS.length - 1 && (
                  <ArrowRightIcon
                    className="mx-2 hidden size-5 shrink-0 text-muted-foreground md:block"
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Animated flow indicator */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {FLOW_STEPS.map((step, i) => {
            const stepId: IntegrationId | null =
              step === "Registration"
                ? "embed"
                : step === "HubSpot Contact"
                  ? "hubspot"
                  : step === "Google Meet Link"
                    ? "google-meet"
                    : null;
            const isHighlighted = stepId !== null && activeIntegration === stepId;
            return (
              <span key={step} className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 transition-colors",
                    isHighlighted ? "bg-brand/20 font-medium text-brand" : ""
                  )}
                >
                  {step}
                </span>
                {i < FLOW_STEPS.length - 1 && (
                  <ArrowRightIcon className="size-4 shrink-0 opacity-50" />
                )}
              </span>
            );
          })}
        </motion.div>

        {/* Live preview panel */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-xl shadow-black/10 dark:shadow-black/30 ring-1 ring-black/5 dark:ring-white/5">
            <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-400/90" />
                <div className="size-2.5 rounded-full bg-amber-400/90" />
                <div className="size-2.5 rounded-full bg-emerald-400/90" />
              </div>
              <div className="flex-1 rounded-lg border border-border/60 bg-background/90 px-4 py-2 text-center text-xs text-muted-foreground shadow-inner">
                app.hubstream.io
                {activeIntegration === "hubspot" && "/settings"}
                {activeIntegration === "google-meet" && "/events/abc123"}
                {activeIntegration === "embed" && "/events/abc123"}
              </div>
            </div>
            <div className="min-h-[260px] bg-background">
              <AnimatePresence mode="wait">
                {activeIntegration === "hubspot" && (
                  <HubSpotPreview key="hubspot" />
                )}
                {activeIntegration === "google-meet" && (
                  <GoogleMeetPreview key="google-meet" />
                )}
                {activeIntegration === "embed" && (
                  <EmbedPreview key="embed" />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PreviewWrapper({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="p-6"
    >
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground">{title}</h3>
      {children}
    </motion.div>
  );
}

function HubSpotPreview() {
  return (
    <PreviewWrapper title="HubSpot CRM connection">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border border-[#FF7A59]/30 bg-[#FF7A59]/5 p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#FF7A59]/20">
            <Building2Icon className="size-5 text-[#FF7A59]" />
          </div>
          <div>
            <p className="font-medium">HubSpot connected</p>
            <p className="text-xs text-muted-foreground">
              Contacts and meeting engagements sync automatically
            </p>
          </div>
          <div className="ml-auto">
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckIcon className="size-3.5" />
              Active
            </span>
          </div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Last sync</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Sarah Chen</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-muted-foreground">Contact created in HubSpot</span>
          </div>
        </div>
      </div>
    </PreviewWrapper>
  );
}

function GoogleMeetPreview() {
  return (
    <PreviewWrapper title="Google Meet link">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#00AC47]/10">
            <VideoIcon className="size-5 text-[#00AC47]" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Meet link generated</p>
            <p className="text-xs text-muted-foreground">
              Created when you published the event
            </p>
          </div>
          <a
            href="#"
            className="flex items-center gap-1 rounded-md border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            meet.google.com/abc-defg-hij
            <ExternalLinkIcon className="size-3" />
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          Attendees receive this link in their confirmation email after registering.
        </p>
      </div>
    </PreviewWrapper>
  );
}

function EmbedPreview() {
  return (
    <PreviewWrapper title="Embed code">
      <div className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Paste this on your website, blog, or landing page:
        </p>
        <pre className="overflow-x-auto rounded-md bg-muted p-3 text-[10px]">
          <code>{`<iframe src="https://hubstream.app/embed/..." width="100%" height="400"></iframe>`}</code>
        </pre>
        <div className="flex items-center gap-2">
          <div className="flex h-8 items-center gap-2 rounded-md border border-brand/50 bg-brand/5 px-3 text-xs font-medium text-brand">
            <CopyIcon className="size-3.5" />
            Copy embed code
          </div>
        </div>
      </div>
    </PreviewWrapper>
  );
}
