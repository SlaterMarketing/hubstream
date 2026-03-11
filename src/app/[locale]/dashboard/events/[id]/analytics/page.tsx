import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsCharts } from "./analytics-charts";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function EventAnalyticsPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const user = session?.user as { orgId?: string | null };

  if (!user?.orgId) return null;

  const event = await db.event.findFirst({
    where: { id, orgId: user.orgId },
    include: {
      _count: { select: { registrations: true } },
      pageViews: true,
    },
  });

  if (!event) notFound();

  const totalViews = event.pageViews.length;
  const uniqueVisitors = new Set(event.pageViews.map((v) => v.visitorHash)).size;
  const registrations = event._count.registrations;
  const conversionRate =
    uniqueVisitors > 0 ? ((registrations / uniqueVisitors) * 100).toFixed(1) : "0";

  const viewsByDay = event.pageViews.reduce<Record<string, number>>((acc, v) => {
    const day = v.viewedAt.toISOString().slice(0, 10);
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});

  const referrers = event.pageViews.reduce<Record<string, number>>((acc, v) => {
    const ref = v.referrer || "(direct)";
    acc[ref] = (acc[ref] ?? 0) + 1;
    return acc;
  }, {});

  const utmSources = event.pageViews.reduce<Record<string, number>>((acc, v) => {
    const s = v.utmSource || "(none)";
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  const countries = event.pageViews.reduce<Record<string, number>>((acc, v) => {
    const c = v.country || "(unknown)";
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});

  const devices = event.pageViews.reduce<Record<string, number>>((acc, v) => {
    const d = v.device || "unknown";
    acc[d] = (acc[d] ?? 0) + 1;
    return acc;
  }, {});

  const registrationsWithUtm = await db.registration.findMany({
    where: { eventId: id, status: "confirmed" },
    select: { utmSource: true, utmMedium: true, utmCampaign: true },
  });

  const utmCampaignStats = Object.entries(
    registrationsWithUtm.reduce<Record<string, { views: number; regs: number }>>((acc, r) => {
      const key = r.utmCampaign || r.utmSource || "(none)";
      if (!acc[key]) acc[key] = { views: 0, regs: 0 };
      acc[key].regs += 1;
      return acc;
    }, {})
  ).map(([campaign, data]) => ({
    campaign,
    views: event.pageViews.filter(
      (v) => (v.utmCampaign || v.utmSource || "(none)") === campaign
    ).length,
    regs: data.regs,
    conversion:
      data.regs > 0
        ? (
            (data.regs /
              Math.max(
                1,
                event.pageViews.filter(
                  (v) => (v.utmCampaign || v.utmSource || "(none)") === campaign
                ).length
              )) *
            100
          ).toFixed(1)
        : "0",
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/events/${id}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to event
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">{event.title}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Page views</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalViews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unique visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{uniqueVisitors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{registrations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{conversionRate}%</p>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts
        viewsByDay={viewsByDay}
        referrers={referrers}
        utmSources={utmSources}
        countries={countries}
        devices={devices}
        utmCampaignStats={utmCampaignStats}
      />
    </div>
  );
}
