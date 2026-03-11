import { setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DashboardEvents } from "@/components/dashboard/dashboard-events";

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

  const eventsForDashboard = events.map((e) => ({
    id: e.id,
    title: e.title,
    startsAt: e.startsAt,
    status: e.status,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your webinars and events
        </p>
      </div>

      <DashboardEvents events={eventsForDashboard} />
    </div>
  );
}
