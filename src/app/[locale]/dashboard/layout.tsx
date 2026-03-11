import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isSuperAdmin } from "@/lib/admin";
import {
  DashboardHeader,
  EventEditorActionsProvider,
} from "@/components/dashboard-header";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = session.user as { orgId?: string | null; email?: string | null };
  if (!user.orgId) {
    redirect("/onboarding");
  }

  return (
    <EventEditorActionsProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader isSuperAdmin={isSuperAdmin(user.email)} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </EventEditorActionsProvider>
  );
}
