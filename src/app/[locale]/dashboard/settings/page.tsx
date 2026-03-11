import { setRequestLocale } from "next-intl/server";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HubSpotConnect } from "./hubspot-connect";
import { GoogleCalendarConnect } from "./google-calendar-connect";
import { OrgSettingsForm } from "./org-settings-form";
import { BillingSection } from "./billing-section";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ hubspot?: string; message?: string; billing?: string }>;
};

export default async function SettingsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const search = await searchParams;
  setRequestLocale(locale);

  const session = await auth();
  const user = session?.user as { orgId?: string | null };
  if (!user?.orgId) return null;

  const org = await db.organization.findUnique({
    where: { id: user.orgId },
  });
  const subscription = await db.subscription.findUnique({
    where: { orgId: user.orgId },
  });
  const integrationSettings = await db.integrationSettings.findUnique({
    where: { orgId: user.orgId },
  });
  const hubspotConnected = !!integrationSettings?.hubspotAccessToken;

  const userId = (session?.user as { id?: string })?.id;
  const googleAccount = userId
    ? await db.account.findFirst({
        where: { userId, provider: "google" },
      })
    : null;
  const googleCalendarConnected =
    !!googleAccount?.access_token && !!googleAccount?.refresh_token;

  if (!org) return null;

  async function reconnectGoogleCalendar() {
    "use server";
    await signOut({ redirectTo: `/${locale}/login?reconnect=calendar` });
  }

  const billingSuccess = search.billing === "success";
  const billingCanceled = search.billing === "canceled";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization and integrations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>
            Your organization name and URL slug
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrgSettingsForm name={org.name} slug={org.slug} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>
            Your plan and payment information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {billingSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Thank you for upgrading! Your Pro plan is now active.
            </p>
          )}
          {billingCanceled && (
            <p className="text-sm text-muted-foreground">
              Checkout was canceled.
            </p>
          )}
          <BillingSection
            plan={org.plan}
            hasSubscription={!!subscription?.stripeSubscriptionId}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect HubSpot to sync contacts and log webinar registrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {search.hubspot === "connected" && (
            <p className="text-sm text-green-600 dark:text-green-400">
              HubSpot connected successfully.
            </p>
          )}
          {search.hubspot === "error" && (
            <p className="text-sm text-destructive">
              {search.message || "Failed to connect HubSpot."}
            </p>
          )}
          <HubSpotConnect connected={hubspotConnected} />
          <div className="border-t pt-4">
            <p className="mb-2 text-sm font-medium">Google Calendar</p>
            <GoogleCalendarConnect
              connected={googleCalendarConnected}
              reconnectAction={reconnectGoogleCalendar}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
