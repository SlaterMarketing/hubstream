import { setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { Navbar } from "@/components/homepage/navbar";
import { Hero } from "@/components/homepage/hero";
import { SocialProof } from "@/components/homepage/social-proof";
import { HowItWorks } from "@/components/homepage/how-it-works";
import { Features } from "@/components/homepage/features";
import { Integrations } from "@/components/homepage/integrations";
import { CaseStudy } from "@/components/homepage/case-study";
import { Testimonials } from "@/components/homepage/testimonials";
import { Pricing } from "@/components/homepage/pricing";
import { FAQ } from "@/components/homepage/faq";
import { FinalCta } from "@/components/homepage/final-cta";
import { Footer } from "@/components/homepage/footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar session={session} />
      <main>
        <Hero session={session} />
        <SocialProof />
        <HowItWorks />
        <Features />
        <Integrations />
        <CaseStudy />
        <Testimonials />
        <Pricing session={session} />
        <FAQ />
        <FinalCta />
        <Footer />
      </main>
    </div>
  );
}
