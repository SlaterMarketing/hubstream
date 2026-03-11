import { setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isSuperAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminUpgradeButton } from "./upgrade-button";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const user = session?.user as { email?: string | null };

  if (!isSuperAdmin(user?.email)) {
    redirect("/dashboard");
  }

  const [users, orgs, pageViewCount, subscriptions] = await Promise.all([
    db.user.findMany({
      include: { organization: true },
      orderBy: { createdAt: "desc" },
    }),
    db.organization.findMany({
      include: {
        _count: {
          select: { users: true, events: true },
        },
        subscription: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.pageView.count(),
    db.subscription.findMany({
      where: { status: "active" },
      include: { organization: true },
    }),
  ]);

  const proOrgsCount = orgs.filter((o) => o.plan === "pro").length;
  const paidProCount = subscriptions.filter((s) => s.stripeSubscriptionId).length;
  const manualProCount = proOrgsCount - paidProCount;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="text-muted-foreground">
          Super admin dashboard – users, organizations, revenue, and pageviews
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orgs.length}</p>
            <p className="text-xs text-muted-foreground">
              {proOrgsCount} Pro ({paidProCount} paid, {manualProCount} manual)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pageviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {pageViewCount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{paidProCount}</p>
            <p className="text-xs text-muted-foreground">
              Stripe subscriptions
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>
            All organizations. Use Upgrade to grant Pro without payment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgs.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {org.slug}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        org.plan === "pro"
                          ? "rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {org.plan}
                    </span>
                  </TableCell>
                  <TableCell>{org._count.users}</TableCell>
                  <TableCell>{org._count.events}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <AdminUpgradeButton
                      orgId={org.id}
                      orgName={org.name}
                      plan={org.plan}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>All registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.email}</TableCell>
                  <TableCell>{u.name ?? "—"}</TableCell>
                  <TableCell>
                    {u.organization?.name ?? (
                      <span className="text-muted-foreground">No org</span>
                    )}
                  </TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
