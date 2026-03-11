"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "hubstream-cookie-consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setShow(true);
  }, []);

  function dismiss() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 p-4 shadow-lg backdrop-blur dark:bg-zinc-900/95">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-center text-sm text-muted-foreground sm:text-left">
          We use cookies for authentication and session management. By continuing, you agree to our{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            privacy policy
          </Link>
          .
        </p>
        <Button size="sm" onClick={dismiss}>
          Accept
        </Button>
      </div>
    </div>
  );
}
