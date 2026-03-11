"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  VideoIcon,
  RefreshCwIcon,
  CodeIcon,
  FormInputIcon,
  GlobeIcon,
  UsersIcon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  UserPlusIcon,
} from "lucide-react";
import { FEATURES } from "@/data/homepage";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ICONS = {
  Video: VideoIcon,
  RefreshCw: RefreshCwIcon,
  Code: CodeIcon,
  FormInput: FormInputIcon,
  Globe: GlobeIcon,
  Users: UsersIcon,
} as const;

type FeatureId = (typeof FEATURES)[number]["id"];

export function Features() {
  const t = useTranslations();
  const [activeFeature, setActiveFeature] = useState<FeatureId>("google-meet");

  return (
    <section id="features" className="scroll-mt-20 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("Homepage.features.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("Homepage.features.subtitle")}
          </p>
        </motion.div>

        {/* Feature cards - clickable */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = ICONS[feature.icon];
            const isActive = activeFeature === feature.id;
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => setActiveFeature(feature.id)}
                className={cn(
                  "rounded-lg border p-5 text-left transition-all",
                  isActive
                    ? "border-brand bg-brand/5 shadow-md ring-2 ring-brand/20"
                    : "border-border bg-card hover:border-brand/50 hover:shadow-sm"
                )}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "rounded-lg p-2.5",
                      isActive ? "bg-brand/20 text-brand" : "bg-brand/10 text-brand"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  {feature.pro && (
                    <Badge variant="brand" className="text-xs">
                      {t("Homepage.features.proBadge")}
                    </Badge>
                  )}
                </div>
                <h3 className="mt-3 font-semibold">{t(feature.titleKey)}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                  {t(feature.descriptionKey)}
                </p>
              </button>
            );
          })}
        </div>

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
                {activeFeature === "google-meet" && "/events/abc123"}
                {activeFeature === "hubspot-sync" && "/events/abc123"}
                {activeFeature === "embed" && "/events/abc123"}
                {activeFeature === "custom-fields" && "/settings"}
                {activeFeature === "custom-domain" && "/settings"}
                {activeFeature === "team" && "/settings"}
              </div>
            </div>
            <div className="min-h-[280px] bg-background">
              <AnimatePresence mode="wait">
                {activeFeature === "google-meet" && (
                  <GoogleMeetPreview key="google-meet" />
                )}
                {activeFeature === "hubspot-sync" && (
                  <HubSpotSyncPreview key="hubspot-sync" />
                )}
                {activeFeature === "embed" && (
                  <EmbedPreview key="embed" />
                )}
                {activeFeature === "custom-fields" && (
                  <CustomFieldsPreview key="custom-fields" />
                )}
                {activeFeature === "custom-domain" && (
                  <CustomDomainPreview key="custom-domain" />
                )}
                {activeFeature === "team" && (
                  <TeamPreview key="team" />
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

function GoogleMeetPreview() {
  return (
    <PreviewWrapper title="Published event — Meet link auto-generated">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border bg-emerald-500/10 p-3">
          <div className="flex items-center gap-2">
            <VideoIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium">Google Meet link ready</span>
          </div>
          <a
            href="#"
            className="flex items-center gap-1 text-xs text-brand hover:underline"
          >
            meet.google.com/abc-defg-hij
            <ExternalLinkIcon className="size-3" />
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          Link generated when you published. Attendees receive it in their confirmation email.
        </p>
      </div>
    </PreviewWrapper>
  );
}

function HubSpotSyncPreview() {
  return (
    <PreviewWrapper title="Registration synced to HubSpot">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#FF7A59]/10">
            <RefreshCwIcon className="size-5 text-[#FF7A59]" />
          </div>
          <div>
            <p className="font-medium">Sarah Chen</p>
            <p className="text-xs text-muted-foreground">sarah@acme.com • Acme Inc</p>
          </div>
          <div className="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Synced
          </div>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <CheckIcon className="size-3.5 shrink-0" />
          Contact created in HubSpot
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <CheckIcon className="size-3.5 shrink-0" />
          Meeting engagement logged
        </div>
      </div>
    </PreviewWrapper>
  );
}

function EmbedPreview() {
  return (
    <PreviewWrapper title="Embed code — paste on your site">
      <div className="space-y-3">
        <pre className="overflow-x-auto rounded-md bg-muted p-3 text-[10px]">
          <code>{`<iframe src="https://hubstream.app/embed/..." width="100%" height="400"></iframe>`}</code>
        </pre>
        <div className="flex items-center gap-2">
          <div className="flex h-8 items-center gap-2 rounded-md border border-brand/50 bg-brand/5 px-3 text-xs font-medium text-brand">
            <CopyIcon className="size-3.5" />
            Copy embed code
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-dashed p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Preview on your site:</p>
          <div className="rounded border bg-muted/30 p-3">
            <div className="space-y-2">
              <div className="h-2 w-20 rounded bg-muted" />
              <div className="h-2 w-full rounded bg-muted" />
              <div className="h-8 w-3/4 rounded bg-brand/20" />
            </div>
          </div>
        </div>
      </div>
    </PreviewWrapper>
  );
}

function CustomFieldsPreview() {
  return (
    <PreviewWrapper title="Custom registration fields">
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <p className="mb-3 text-xs font-medium text-muted-foreground">Registration form fields</p>
          <div className="space-y-2">
            {["First name", "Last name", "Email", "Company", "Job title", "Phone", "Lead source"].map(
              (field, i) => (
                <div
                  key={field}
                  className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2 text-sm"
                >
                  <span>{field}</span>
                  {i >= 5 && (
                    <span className="rounded bg-brand/10 px-1.5 text-[10px] font-medium text-brand">
                      Custom
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </PreviewWrapper>
  );
}

function CustomDomainPreview() {
  return (
    <PreviewWrapper title="Custom domain settings">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Event page domain</label>
          <div className="mt-1 flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
            <GlobeIcon className="size-4 text-muted-foreground" />
            <span className="text-sm">events.yourcompany.com</span>
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-brand/30 bg-brand/5 p-3">
          <p className="text-xs text-muted-foreground">
            Your event URLs: <span className="font-medium text-foreground">events.yourcompany.com/product-launch</span>
          </p>
        </div>
      </div>
    </PreviewWrapper>
  );
}

function TeamPreview() {
  return (
    <PreviewWrapper title="Team members">
      <div className="space-y-3">
        {[
          { name: "You", email: "you@company.com", role: "Owner" },
          { name: "Jane Smith", email: "jane@company.com", role: "Editor" },
          { name: "Mike Johnson", email: "mike@company.com", role: "Editor" },
        ].map((member) => (
          <div
            key={member.email}
            className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{member.role}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-brand/50 bg-brand/5 p-3">
          <UserPlusIcon className="size-4 text-brand" />
          <span className="text-sm font-medium text-brand">Invite team member</span>
        </div>
      </div>
    </PreviewWrapper>
  );
}
