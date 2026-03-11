import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isSuperAdmin } from "@/lib/admin";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = session.user as { email?: string | null };
  if (!isSuperAdmin(user?.email)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeftIcon className="size-4" />
              Dashboard
            </Button>
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link href="/admin" className="flex items-center gap-2">
            <BrandLogo showImage={false} size="sm" />
            <span className="font-semibold">Admin</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
