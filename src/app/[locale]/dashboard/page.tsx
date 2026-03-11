import { setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const user = session?.user as { orgId?: string | null };

  if (!user?.orgId) return null;

  const events = await db.event.findMany({
    where: { orgId: user.orgId },
    orderBy: { startsAt: "asc" },
  });

  const now = new Date();
  const upcoming = events.filter((e) => e.status === "published" && e.startsAt > now);
  const past = events.filter((e) => e.startsAt <= now);
  const drafts = events.filter((e) => e.status === "draft");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your webinars and events
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>{upcoming.length} published events</CardDescription>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming events</p>
            ) : (
              <ul className="space-y-2">
                {upcoming.slice(0, 3).map((event) => (
                  <li key={event.id}>
                    <Link
                      href={`/dashboard/events/${event.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {event.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {event.startsAt.toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Drafts</CardTitle>
            <CardDescription>{drafts.length} draft events</CardDescription>
          </CardHeader>
          <CardContent>
            {drafts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No drafts</p>
            ) : (
              <ul className="space-y-2">
                {drafts.slice(0, 3).map((event) => (
                  <li key={event.id}>
                    <Link
                      href={`/dashboard/events/${event.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {event.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Past</CardTitle>
            <CardDescription>{past.length} past events</CardDescription>
          </CardHeader>
          <CardContent>
            {past.length === 0 ? (
              <p className="text-sm text-muted-foreground">No past events</p>
            ) : (
              <ul className="space-y-2">
                {past.slice(0, 3).map((event) => (
                  <li key={event.id}>
                    <Link
                      href={`/dashboard/events/${event.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {event.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Link href="/dashboard/events/new">
          <Button>Create new event</Button>
        </Link>
      </div>
    </div>
  );
}
