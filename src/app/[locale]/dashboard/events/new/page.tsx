import { setRequestLocale } from "next-intl/server";
import { EventPageEditor } from "@/components/event-page-editor/event-page-editor";

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
      <EventPageEditor mode="create" />
    </div>
  );
}
