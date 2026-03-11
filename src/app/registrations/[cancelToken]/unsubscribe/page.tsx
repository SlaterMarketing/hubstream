import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { unsubscribeFromReminders } from "@/app/actions/registrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UnsubscribeButton } from "./unsubscribe-button";

type Props = {
  params: Promise<{ cancelToken: string }>;
};

export default async function UnsubscribePage({ params }: Props) {
  const { cancelToken } = await params;

  const registration = await db.registration.findUnique({
    where: { cancelToken },
    include: { event: true },
  });
  if (!registration) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Unsubscribe from reminders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to stop receiving reminder emails for &quot;
            {registration.event.title}&quot;? You will still receive your registration
            confirmation. You can re-register anytime to receive reminders again.
          </p>
          <UnsubscribeButton cancelToken={cancelToken} />
        </CardContent>
      </Card>
    </div>
  );
}
