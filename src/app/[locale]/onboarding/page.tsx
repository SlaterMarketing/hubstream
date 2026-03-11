import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { OnboardingForm } from "./onboarding-form";
import { OnboardingBrandingForm } from "./onboarding-branding-form";
import { OnboardingIntegrationsForm } from "./onboarding-integrations-form";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ step?: string }>;
};

export default async function OnboardingPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const search = await searchParams;
  setRequestLocale(locale);
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = session.user as { id: string; orgId?: string | null };
  const step = search.step;

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    include: { organization: true },
  });

  // Has org and not on a known onboarding step - go to dashboard
  if (dbUser?.orgId && step !== "branding" && step !== "integrations") {
    redirect("/dashboard");
  }

  // No org yet - show create org form
  if (!dbUser?.orgId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <OnboardingForm userId={user.id} />
      </div>
    );
  }

  // Integrations step
  if (step === "integrations") {
    const integrationSettings = await db.integrationSettings.findUnique({
      where: { orgId: dbUser.orgId! },
    });
    const hubspotConnected = !!integrationSettings?.hubspotAccessToken;

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <OnboardingIntegrationsForm
          hubspotConnected={hubspotConnected}
          locale={locale}
        />
      </div>
    );
  }

  // Branding step (default when has org)
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <OnboardingBrandingForm
        orgId={dbUser.orgId}
        logoUrl={dbUser.organization?.logoUrl ?? null}
        ctaColor={dbUser.organization?.ctaColor ?? null}
      />
    </div>
  );
}
