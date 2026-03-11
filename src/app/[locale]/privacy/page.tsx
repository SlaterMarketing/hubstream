import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            HubStream
          </Link>
          <nav className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-12 space-y-8 text-sm">
          <section>
            <h2 className="text-xl font-semibold">Data we collect</h2>
            <p className="mt-2 text-muted-foreground">
              When you register for a webinar, we collect your name, email, company, job title, and any custom fields the event organizer has configured. We also store consent records (including IP address and timestamp) for GDPR compliance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">How we use your data</h2>
            <p className="mt-2 text-muted-foreground">
              Your registration data is shared with the event organizer. If they have connected HubSpot, your contact information may be synced to their CRM. We use your email to send confirmation and reminder emails about the event.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Third-party services</h2>
            <p className="mt-2 text-muted-foreground">
              We use Google (for authentication and calendar/Meet integration), HubSpot (for CRM sync when connected), Resend (for email delivery), Stripe (for billing), and Cloudflare R2 (for file storage). Each has their own privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Your rights (GDPR)</h2>
            <p className="mt-2 text-muted-foreground">
              You have the right to access, rectify, or erase your personal data. You can cancel your registration at any time using the link in your confirmation email. To request data deletion, contact the event organizer or reach out to us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Cookies</h2>
            <p className="mt-2 text-muted-foreground">
              We use only functional cookies necessary for authentication and session management. We do not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="mt-2 text-muted-foreground">
              For privacy-related questions, contact us at privacy@hubstream.app.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
