import { setRequestLocale } from "next-intl/server";
import { EventForm } from "@/components/event-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewEventPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create new event</h1>
        <p className="text-muted-foreground">
          Create a draft, then publish to generate a Google Meet link
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Event details</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
