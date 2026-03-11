import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <BrandLogo />
          </Link>
          <nav className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            {session?.user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button>Sign in with Google</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        <section className="mb-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Lightweight webinar management for Google Meet and HubSpot
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Create events, embed signup forms, and sync everything to your CRM. No complex setup.
          </p>
          <div className="mt-10">
            {session?.user ? (
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg">Get started free</Button>
              </Link>
            )}
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-center text-2xl font-bold">Pricing</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>For trying out</CardDescription>
                <p className="text-3xl font-bold">$0</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-2 text-sm">
                  <li>1 published webinar at a time</li>
                  <li>Up to 50 attendees per webinar</li>
                  <li>1 team member</li>
                  <li>Powered by <BrandLogo showImage={false} size="sm" /> on embeds</li>
                </ul>
                {!session?.user && (
                  <Link href="/login">
                    <Button variant="outline" className="w-full">Get started</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For growing teams</CardDescription>
                <p className="text-3xl font-bold">$10<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                <p className="text-sm text-muted-foreground">or $99/year</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-2 text-sm">
                  <li>Unlimited published webinars</li>
                  <li>Up to 100 attendees per webinar</li>
                  <li>Unlimited team members</li>
                  <li>No branding on embeds</li>
                  <li>Custom domain for event pages</li>
                  <li>Custom registration fields</li>
                </ul>
                {!session?.user && (
                  <Link href="/login">
                    <Button className="w-full">Start free trial</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-24 text-center">
          <h2 className="text-2xl font-bold">Features</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold">Google Meet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Auto-generate Meet links when you publish. No manual setup.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">HubSpot sync</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Contacts and meeting engagements sync to your CRM automatically.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Embed anywhere</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add signup forms to your website, blog, or landing pages.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:underline">Privacy policy</Link>
          {" · "}
          <span>© {new Date().getFullYear()} <BrandLogo showImage={false} size="sm" /></span>
        </div>
      </footer>
    </div>
  );
}
