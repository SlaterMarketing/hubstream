"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckCircle2Icon } from "lucide-react";

export function InteractiveDemo() {
  const t = useTranslations();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 800);
  }

  function handleReset() {
    setSubmitted(false);
    setFirstName("");
    setLastName("");
    setEmail("");
  }

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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
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
                events.yoursite.com/product-launch
              </div>
            </div>

            {/* Webinar context */}
            <div className="border-b bg-muted/20 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-lg bg-brand/10">
                  <CalendarIcon className="size-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold">Product Launch Webinar</h3>
                  <p className="text-xs text-muted-foreground">
                    March 15, 2025 at 2:00 PM • 60 min
                  </p>
                </div>
              </div>
            </div>

            {/* Form content */}
            <div className="p-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-6 text-center"
                >
                  <CheckCircle2Icon className="mx-auto size-12 text-emerald-500" />
                  <p className="mt-3 font-medium text-emerald-700 dark:text-emerald-400">
                    You&apos;re registered!
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Check your email for the meeting link.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={handleReset}
                  >
                    Try again
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="demo-firstName"
                        className="text-sm font-medium"
                      >
                        {t("Homepage.interactiveDemo.firstName")}
                      </label>
                      <Input
                        id="demo-firstName"
                        className="mt-1"
                        placeholder="Jane"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="demo-lastName"
                        className="text-sm font-medium"
                      >
                        {t("Homepage.interactiveDemo.lastName")}
                      </label>
                      <Input
                        id="demo-lastName"
                        className="mt-1"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="demo-email"
                      className="text-sm font-medium"
                    >
                      {t("Homepage.interactiveDemo.email")} *
                    </label>
                    <Input
                      id="demo-email"
                      type="email"
                      className="mt-1"
                      placeholder="jane@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Registering...
                      </span>
                    ) : (
                      t("Homepage.interactiveDemo.register")
                    )}
                  </Button>
                </form>
              )}
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {t("Homepage.interactiveDemo.demoNote")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
