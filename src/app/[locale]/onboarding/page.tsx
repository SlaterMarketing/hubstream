import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { OnboardingForm } from "./onboarding-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OnboardingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = session.user as { id: string; orgId?: string | null };
  if (user.orgId) {
    redirect("/dashboard");
  }

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    include: { organization: true },
  });

  if (dbUser?.orgId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <OnboardingForm userId={user.id} />
    </div>
  );
}
