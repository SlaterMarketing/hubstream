import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CancelButton } from "./cancel-button";

type Props = {
  params: Promise<{ cancelToken: string }>;
};

export default async function CancelRegistrationPage({ params }: Props) {
  const { cancelToken } = await params;

  const registration = await db.registration.findUnique({
    where: { cancelToken },
    include: { event: true },
  });
  if (!registration) notFound();
  if (registration.status === "cancelled") {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Already cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your registration for &quot;{registration.event.title}&quot; has already been
              cancelled.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Cancel registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to cancel your registration for &quot;{registration.event.title}
            &quot;? You will no longer receive reminders or the meeting link.
          </p>
          <CancelButton cancelToken={cancelToken} />
        </CardContent>
      </Card>
    </div>
  );
}
