"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Button } from "@/components/ui/button";
import { createContext, useContext, useRef, useState, type ReactNode } from "react";

type EventEditorActions = {
  save: () => Promise<void>;
  publish: () => Promise<void>;
};

type EventEditorContextValue = {
  actionsRef: React.MutableRefObject<EventEditorActions | null>;
  canPublish: boolean;
  setCanPublish: (v: boolean) => void;
  isPublishing: boolean;
  setIsPublishing: (v: boolean) => void;
};

const EventEditorContext = createContext<EventEditorContextValue | null>(null);

export function useEventEditorActions() {
  return useContext(EventEditorContext);
}

export function EventEditorActionsProvider({ children }: { children: ReactNode }) {
  const actionsRef = useRef<EventEditorActions | null>(null);
  const [canPublish, setCanPublish] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  return (
    <EventEditorContext.Provider
      value={{ actionsRef, canPublish, setCanPublish, isPublishing, setIsPublishing }}
    >
      {children}
    </EventEditorContext.Provider>
  );
}

export function DashboardHeader({
  isSuperAdmin = false,
}: {
  isSuperAdmin?: boolean;
}) {
  const pathname = usePathname();

  const isEventNew = pathname?.includes("/events/new") ?? false;
  const isEventEdit =
    (pathname?.includes("/events/") && !pathname?.includes("/events/new") && !pathname?.includes("/analytics")) ??
    false;

  const isEventPage = isEventNew || isEventEdit;

  // Hide header on event page - Back to dashboard + Publish live in the hero (EventPageHeader)
  if (isEventPage) return null;

  return (
    <header>
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center">
          <BrandLogo />
        </Link>
        <nav className="flex items-center gap-4">
          {isSuperAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Admin
            </Link>
          )}
          <ProfileDropdown isSuperAdmin={isSuperAdmin} />
        </nav>
      </div>
    </header>
  );
}
