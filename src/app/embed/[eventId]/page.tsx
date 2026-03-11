import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { RegistrationForm } from "@/components/registration-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmbedResize } from "./embed-resize";

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

  return (
    <div className="w-full max-w-md bg-background p-4" id="embed-root">
      <EmbedResize />
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Register</CardTitle>
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
              ctaColor={event.organization.ctaColor}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
