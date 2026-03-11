import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

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

  const user = session.user as { orgId?: string | null };
  if (!user.orgId) {
    redirect("/onboarding");
  }

  const org = await db.organization.findUnique({
    where: { id: user.orgId },
  });
  const isFree = org?.plan === "free";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center">
            <BrandLogo />
          </Link>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link href="/dashboard/events/new">
              <Button size="sm">New event</Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="sm">
                Settings
              </Button>
            </Link>
            <form
              action={async () => {
                "use server";
                const { signOut } = await import("@/auth");
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button variant="ghost" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-6">
        {isFree && (
          <div className="mb-6 rounded-lg border bg-muted/50 px-4 py-2 text-center text-sm">
            On the Free plan.{" "}
            <Link href="/dashboard/settings" className="font-medium text-primary hover:underline">
              Upgrade to Pro
            </Link>{" "}
            for unlimited webinars and more.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
