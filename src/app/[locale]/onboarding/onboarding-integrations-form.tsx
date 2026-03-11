"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HubSpotConnect } from "@/app/[locale]/dashboard/settings/hubspot-connect";

type Props = {
  hubspotConnected: boolean;
  locale: string;
};

export function OnboardingIntegrationsForm({ hubspotConnected, locale }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hubspotStatus = searchParams.get("hubspot");
  const hubspotMessage = searchParams.get("message");

  function handleContinue() {
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connect your tools (optional)</CardTitle>
        <CardDescription>
          Sync webinar registrations to HubSpot so you can follow up with leads. You can add more integrations later in settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hubspotStatus === "connected" && (
          <p className="text-sm text-green-600 dark:text-green-400">
            HubSpot connected successfully.
          </p>
        )}
        {hubspotStatus === "error" && (
          <p className="text-sm text-destructive">
            {hubspotMessage || "Failed to connect HubSpot."}
          </p>
        )}
        <div>
          <p className="text-sm font-medium mb-2">HubSpot</p>
          <p className="text-xs text-muted-foreground mb-2">
            Sync event registrations to your HubSpot CRM
          </p>
          <HubSpotConnect
            connected={hubspotConnected}
            locale={locale}
            returnTo="onboarding"
          />
        </div>
        <Button onClick={handleContinue} className="w-full">
          Continue to dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
