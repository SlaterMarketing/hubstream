"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CalendarIcon,
  ListIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type EventForDashboard = {
  id: string;
  title: string;
  startsAt: string | Date;
  status: string;
};

type Props = {
  events: EventForDashboard[];
};

function getEventStatus(event: EventForDashboard): "draft" | "published" | "past" {
  const now = new Date();
  const startsAt = new Date(event.startsAt);
  if (event.status === "draft") return "draft";
  if (startsAt <= now) return "past";
  return "published";
}

function StatusBadge({ status }: { status: "draft" | "published" | "past" }) {
  const t = useTranslations("Dashboard");
  const variant =
    status === "draft"
      ? "secondary"
      : status === "published"
        ? "brand"
        : "outline";
  return (
    <Badge variant={variant} className="text-[10px] font-medium uppercase tracking-wide">
      {t(status)}
    </Badge>
  );
}

function EventsListView({ events }: { events: EventForDashboard[] }) {
  const t = useTranslations("Dashboard");
  const sorted = [...events].sort(
    (a, b) =>
      new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 py-16 text-center">
        <p className="text-muted-foreground">{t("noEvents")}</p>
        <Link href="/dashboard/events/new" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            {t("createEvent")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {sorted.map((event) => {
        const status = getEventStatus(event);
        const date = new Date(event.startsAt as string | Date);
        return (
          <Link
            key={event.id}
            href={`/dashboard/events/${event.id}`}
            className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                {date.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <StatusBadge status={status} />
          </Link>
        );
      })}
    </div>
  );
}

function EventsCalendarView({ events }: { events: EventForDashboard[] }) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const eventsByDay = events.reduce<Record<string, EventForDashboard[]>>(
    (acc, event) => {
      const d = new Date(event.startsAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = String(d.getDate());
        if (!acc[key]) acc[key] = [];
        acc[key].push(event);
      }
      return acc;
    },
    {}
  );

  const locale = useLocale();
  const dayNames = [0, 1, 2, 3, 4, 5, 6].map((d) =>
    new Date(2000, 0, 2 + d).toLocaleDateString(locale, { weekday: "short" })
  );
  const gridDays: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) gridDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) gridDays.push(d);

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold">{monthName}</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth} aria-label="Next month">
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-px text-center text-xs font-medium text-muted-foreground">
          {dayNames.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {gridDays.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }
            const dayEvents = eventsByDay[String(day)] ?? [];
            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year;
            return (
              <div
                key={day}
                className={cn(
                  "aspect-square rounded-lg p-1",
                  isToday && "ring-1 ring-primary bg-primary/5"
                )}
              >
                <span className="text-xs font-medium">{day}</span>
                {dayEvents.length > 0 && (
                  <div className="mt-0.5 space-y-0.5">
                    {dayEvents.slice(0, 2).map((e) => (
                      <Link
                        key={e.id}
                        href={`/dashboard/events/${e.id}`}
                        className="block truncate rounded bg-primary/10 px-1 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20"
                        title={e.title}
                      >
                        {e.title}
                      </Link>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="block px-1 text-[10px] text-muted-foreground">
                        +{dayEvents.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DashboardEvents({ events }: Props) {
  const t = useTranslations("Dashboard");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs defaultValue="list" className="w-full">
          <div className="flex flex-wrap items-center gap-3">
            <TabsList>
              <TabsTrigger value="list" className="gap-1.5">
                <ListIcon className="size-4" />
                {t("listView")}
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-1.5">
                <CalendarIcon className="size-4" />
                {t("calendarView")}
              </TabsTrigger>
            </TabsList>
            <Link href="/dashboard/events/new">
              <Button size="sm">{t("createEvent")}</Button>
            </Link>
          </div>
          <TabsContent value="list" className="mt-4">
            <EventsListView events={events} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-4">
            <EventsCalendarView events={events} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
