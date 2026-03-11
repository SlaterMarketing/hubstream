import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { RegistrationForm } from "@/components/registration-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ utm_source?: string; utm_medium?: string; utm_campaign?: string }>;
};

export default async function EmbedEventPage({ params, searchParams }: Props) {
  const { eventId } = await params;
  const search = await searchParams;

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: { organization: true },
  });
  const registrationFields = (event?.registrationFields ?? []) as Array<{
    key: string;
    label: string;
    type: "text" | "select" | "checkbox";
    required?: boolean;
    options?: string[];
  }>;
  if (!event) notFound();

  const now = new Date();
  const isPast = event.startsAt <= now;
  const isCancelled = event.status === "cancelled";
  const isPublished = event.status === "published";
  const showRegistration = isPublished && !isPast && !isCancelled;
  const showPoweredBy = event.organization.plan !== "pro";

  const formattedDateTime = event.startsAt.toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero section - 100vh x 100vw */}
      <section className="relative flex h-screen w-full flex-col items-center justify-center px-4">
        {event.coverImageUrl && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.coverImageUrl})` }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}
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
            {formattedDateTime} • {event.durationMinutes} min
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-md p-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {event.startsAt.toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}{" "}
              • {event.durationMinutes} min
            </p>
          </CardHeader>
          <CardContent>
            {isCancelled && (
              <p className="text-sm text-destructive">This event has been cancelled.</p>
            )}
            {isPast && !isCancelled && (
              <p className="text-sm text-muted-foreground">This event has ended.</p>
            )}
            {showRegistration && (
              <RegistrationForm
                eventId={event.id}
                locale="en"
                registrationFields={registrationFields}
                utmSource={search.utm_source}
                utmMedium={search.utm_medium}
                utmCampaign={search.utm_campaign}
                showPoweredBy={showPoweredBy}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
