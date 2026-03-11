import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { RegistrationForm } from "@/components/registration-form";
import { PageViewTracker } from "@/components/page-view-tracker";
import { LanguageSwitcher } from "@/components/language-switcher";

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
    description: event.subtitle || (event.speakers ? `With ${event.speakers}` : undefined),
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
    include: {
      eventSpeakers: {
        include: { speaker: true },
        orderBy: { sortOrder: "asc" },
      },
    },
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

  const registrationFields = (event.registrationFields ?? []) as Array<{
    key: string;
    label: string;
    type: "text" | "select" | "checkbox";
    required?: boolean;
    options?: string[];
  }>;

  const media = (event.media ?? []) as Array<{ type: string; url?: string; videoId?: string }>;

  const formattedDateTime = event.startsAt.toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
  const durationText = `${event.durationMinutes} min`;

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
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Hero section - 100vh x 100vw */}
        <section className="relative flex h-screen w-full min-w-full flex-col items-center justify-center px-4">
          {event.coverImageUrl && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${event.coverImageUrl})` }}
              />
              <div className="absolute inset-0 bg-black/50" />
            </>
          )}
          <div className="absolute right-4 top-4 z-10">
            <LanguageSwitcher />
          </div>
          <div
            className={`relative z-0 flex flex-col items-center justify-center text-center ${
              event.coverImageUrl ? "text-white [&_.text-muted-foreground]:text-white/80" : ""
            }`}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {event.title}
            </h1>
            {event.subtitle && (
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                {event.subtitle}
              </p>
            )}
            <p className="mt-6 text-lg text-muted-foreground">
              {formattedDateTime} • {durationText}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl py-12 px-4">
          {isCancelled && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive mb-8">
              This event has been cancelled.
            </div>
          )}

          {isPast && !isCancelled && (
            <div className="rounded-lg border bg-muted p-4 text-center text-muted-foreground mb-8">
              This event has ended.
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            <div className="space-y-8">

              {event.description && (
                <div className="prose dark:prose-invert max-w-none">
                  <TiptapRenderer content={event.description} />
                </div>
              )}

              {media.length > 0 && (
                <div className="space-y-4">
                  {media.map((item, i) =>
                    item.type === "image" && item.url ? (
                      <img
                        key={i}
                        src={item.url}
                        alt=""
                        className="w-full rounded-xl"
                      />
                    ) : item.type === "youtube" && item.videoId ? (
                      <div key={i} className="aspect-video overflow-hidden rounded-xl">
                        <iframe
                          src={`https://www.youtube.com/embed/${item.videoId}`}
                          title="YouTube"
                          className="h-full w-full"
                          allowFullScreen
                        />
                      </div>
                    ) : null
                  )}
                </div>
              )}

              {event.eventSpeakers.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Speakers</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {event.eventSpeakers.map(({ speaker }) => (
                      <div
                        key={speaker.id}
                        className="flex gap-4 rounded-lg border p-4"
                      >
                        {speaker.imageUrl ? (
                          <img
                            src={speaker.imageUrl}
                            alt={speaker.name}
                            className="size-16 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="size-16 rounded-full bg-muted shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium">{speaker.name}</p>
                          {speaker.bio && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {speaker.bio}
                            </p>
                          )}
                          {(speaker.socialLinks as { twitter?: string; linkedin?: string; website?: string }) && (
                            <div className="mt-2 flex gap-2">
                              {(speaker.socialLinks as { twitter?: string }).twitter && (
                                <a
                                  href={(speaker.socialLinks as { twitter?: string }).twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline"
                                >
                                  Twitter
                                </a>
                              )}
                              {(speaker.socialLinks as { linkedin?: string }).linkedin && (
                                <a
                                  href={(speaker.socialLinks as { linkedin?: string }).linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline"
                                >
                                  LinkedIn
                                </a>
                              )}
                              {(speaker.socialLinks as { website?: string }).website && (
                                <a
                                  href={(speaker.socialLinks as { website?: string }).website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline"
                                >
                                  Website
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!event.eventSpeakers.length && event.speakers && (
                <p className="text-sm text-muted-foreground">
                  Speakers: {event.speakers}
                </p>
              )}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              {showRegistration && (
                <div className="rounded-xl border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold">Register</h2>
                  <RegistrationForm
                    eventId={event.id}
                    locale={locale}
                    registrationFields={registrationFields}
                    utmSource={search.utm_source}
                    utmMedium={search.utm_medium}
                    utmCampaign={search.utm_campaign}
                  />
                  {event.meetLink && (
                    <a
                      href={event.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 block text-center text-sm text-primary hover:underline"
                    >
                      Join Google Meet
                    </a>
                  )}
                </div>
              )}
            </aside>
          </div>

          {isPast && event.recordingUrl && (
            <div className="mt-8">
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
        </div>
      </div>
    </>
  );
}
