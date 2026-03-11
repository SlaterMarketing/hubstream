import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { RegistrationForm } from "@/components/registration-form";
import { PageViewTracker } from "@/components/page-view-tracker";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: Promise<{ locale: string; orgSlug: string; eventSlug: string }>;
  searchParams: Promise<{ utm_source?: string; utm_medium?: string; utm_campaign?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { orgSlug, eventSlug } = await params;
  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
    select: { id: true, name: true },
  });
  const event = org
    ? await db.event.findFirst({
        where: { slug: eventSlug, orgId: org.id },
      })
    : null;
  if (!event || !org) return { title: "HubStream" };
  return {
    title: event.title,
    description: event.speakers ? `With ${event.speakers}` : undefined,
    openGraph: {
      title: event.title,
      type: "website",
    },
  };
}

export default async function PublicEventPage({ params, searchParams }: Props) {
  const { locale, orgSlug, eventSlug } = await params;
  const search = await searchParams;
  setRequestLocale(locale);

  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
    select: { id: true, name: true, logoUrl: true },
  });
  if (!org) notFound();

  const event = await db.event.findFirst({
    where: { orgId: org.id, slug: eventSlug },
  });
  if (!event) notFound();

  const now = new Date();
  const isPast = event.startsAt <= now;
  const isCancelled = event.status === "cancelled";
  const isPublished = event.status === "published";
  const showRegistration = isPublished && !isPast && !isCancelled;

  const endsAt = new Date(event.startsAt.getTime() + event.durationMinutes * 60 * 1000);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startsAt.toISOString(),
    endDate: endsAt.toISOString(),
    organizer: { "@type": "Organization", name: org.name },
    eventStatus: event.status === "cancelled" ? "EventCancelled" : "EventScheduled",
    ...(event.meetLink && {
      location: {
        "@type": "VirtualLocation",
        url: event.meetLink,
      },
    }),
  };

  return (
    <>
      <PageViewTracker
        eventId={event.id}
        utmSource={search.utm_source}
        utmMedium={search.utm_medium}
        utmCampaign={search.utm_campaign}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        {isCancelled && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
            This event has been cancelled.
          </div>
        )}

        {isPast && !isCancelled && (
          <div className="rounded-lg border bg-muted p-4 text-center text-muted-foreground">
            This event has ended.
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{event.title}</CardTitle>
            <CardDescription>
              {event.startsAt.toLocaleString(undefined, {
                dateStyle: "full",
                timeStyle: "short",
              })}{" "}
              • {event.durationMinutes} min
            </CardDescription>
            {event.speakers && (
              <p className="text-sm text-muted-foreground">
                Speakers: {event.speakers}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {event.description && (
              <div>
                <TiptapRenderer content={event.description} />
              </div>
            )}

            {showRegistration && (
              <div className="space-y-4">
                <RegistrationForm
                  eventId={event.id}
                  locale={locale}
                  utmSource={search.utm_source}
                  utmMedium={search.utm_medium}
                  utmCampaign={search.utm_campaign}
                />
                {event.meetLink && (
                  <a
                    href={event.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-sm text-primary hover:underline"
                  >
                    Join Google Meet
                  </a>
                )}
              </div>
            )}

            {isPast && event.recordingUrl && (
              <div>
                <a
                  href={event.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Watch recording
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
