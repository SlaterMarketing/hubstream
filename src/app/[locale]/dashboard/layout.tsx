import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { ProfileDropdown } from "@/components/profile-dropdown";

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

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center">
            <BrandLogo />
          </Link>
          <nav className="flex items-center gap-4">
            <ProfileDropdown />
          </nav>
        </div>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
