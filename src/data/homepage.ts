export const HOW_IT_WORKS_STEPS = [
  {
    id: "create",
    titleKey: "Homepage.howItWorks.create.title",
    descriptionKey: "Homepage.howItWorks.create.description",
    icon: "PenLine" as const,
  },
  {
    id: "embed",
    titleKey: "Homepage.howItWorks.embed.title",
    descriptionKey: "Homepage.howItWorks.embed.description",
    icon: "Code2" as const,
  },
  {
    id: "engage",
    titleKey: "Homepage.howItWorks.engage.title",
    descriptionKey: "Homepage.howItWorks.engage.description",
    icon: "Users" as const,
  },
] as const;

export const FEATURES = [
  {
    id: "google-meet",
    titleKey: "Homepage.features.googleMeet.title",
    descriptionKey: "Homepage.features.googleMeet.description",
    icon: "Video" as const,
    pro: false,
  },
  {
    id: "hubspot-sync",
    titleKey: "Homepage.features.hubspotSync.title",
    descriptionKey: "Homepage.features.hubspotSync.description",
    icon: "RefreshCw" as const,
    pro: false,
  },
  {
    id: "embed",
    titleKey: "Homepage.features.embed.title",
    descriptionKey: "Homepage.features.embed.description",
    icon: "Code" as const,
    pro: false,
  },
  {
    id: "custom-fields",
    titleKey: "Homepage.features.customFields.title",
    descriptionKey: "Homepage.features.customFields.description",
    icon: "FormInput" as const,
    pro: true,
  },
  {
    id: "custom-domain",
    titleKey: "Homepage.features.customDomain.title",
    descriptionKey: "Homepage.features.customDomain.description",
    icon: "Globe" as const,
    pro: true,
  },
  {
    id: "team",
    titleKey: "Homepage.features.team.title",
    descriptionKey: "Homepage.features.team.description",
    icon: "Users" as const,
    pro: true,
  },
] as const;

export const INTEGRATIONS = [
  {
    id: "hubspot",
    nameKey: "Homepage.integrations.hubspot.name",
    descriptionKey: "Homepage.integrations.hubspot.description",
    icon: "Building2" as const,
  },
  {
    id: "google-meet",
    nameKey: "Homepage.integrations.googleMeet.name",
    descriptionKey: "Homepage.integrations.googleMeet.description",
    icon: "Video" as const,
  },
  {
    id: "embed",
    nameKey: "Homepage.integrations.embed.name",
    descriptionKey: "Homepage.integrations.embed.description",
    icon: "Code" as const,
  },
] as const;

export const STATS = [
  { value: 500, suffix: "+", labelKey: "Homepage.stats.webinars" },
  { value: 10000, suffix: "+", labelKey: "Homepage.stats.registrations" },
  { value: 95, suffix: "%", labelKey: "Homepage.stats.setupTime" },
] as const;

export const TESTIMONIALS = [
  {
    id: "1",
    quoteKey: "Homepage.testimonials.1.quote",
    authorKey: "Homepage.testimonials.1.author",
    titleKey: "Homepage.testimonials.1.title",
    companyKey: "Homepage.testimonials.1.company",
    metricKey: "Homepage.testimonials.1.metric",
  },
  {
    id: "2",
    quoteKey: "Homepage.testimonials.2.quote",
    authorKey: "Homepage.testimonials.2.author",
    titleKey: "Homepage.testimonials.2.title",
    companyKey: "Homepage.testimonials.2.company",
    metricKey: "Homepage.testimonials.2.metric",
  },
  {
    id: "3",
    quoteKey: "Homepage.testimonials.3.quote",
    authorKey: "Homepage.testimonials.3.author",
    titleKey: "Homepage.testimonials.3.title",
    companyKey: "Homepage.testimonials.3.company",
    metricKey: "Homepage.testimonials.3.metric",
  },
] as const;

export const FAQ_ITEMS = [
  {
    id: "what-is",
    questionKey: "Homepage.faq.whatIs.question",
    answerKey: "Homepage.faq.whatIs.answer",
  },
  {
    id: "google-meet",
    questionKey: "Homepage.faq.googleMeet.question",
    answerKey: "Homepage.faq.googleMeet.answer",
  },
  {
    id: "hubspot-sync",
    questionKey: "Homepage.faq.hubspotSync.question",
    answerKey: "Homepage.faq.hubspotSync.answer",
  },
  {
    id: "embed",
    questionKey: "Homepage.faq.embed.question",
    answerKey: "Homepage.faq.embed.answer",
  },
  {
    id: "free-limits",
    questionKey: "Homepage.faq.freeLimits.question",
    answerKey: "Homepage.faq.freeLimits.answer",
  },
  {
    id: "upgrade",
    questionKey: "Homepage.faq.upgrade.question",
    answerKey: "Homepage.faq.upgrade.answer",
  },
  {
    id: "free-trial",
    questionKey: "Homepage.faq.freeTrial.question",
    answerKey: "Homepage.faq.freeTrial.answer",
  },
  {
    id: "custom-domain",
    questionKey: "Homepage.faq.customDomain.question",
    answerKey: "Homepage.faq.customDomain.answer",
  },
] as const;

export const PRICING_PLANS = {
  free: {
    nameKey: "Homepage.pricing.free.name",
    descriptionKey: "Homepage.pricing.free.description",
    popular: false,
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "Homepage.pricing.free.features.1",
      "Homepage.pricing.free.features.2",
      "Homepage.pricing.free.features.3",
      "Homepage.pricing.free.features.4",
      "Homepage.pricing.free.features.5",
      "Homepage.pricing.free.features.6",
    ] as const,
  },
  pro: {
    nameKey: "Homepage.pricing.pro.name",
    descriptionKey: "Homepage.pricing.pro.description",
    priceMonthly: 10,
    priceYearly: 99,
    popular: true,
    features: [
      "Homepage.pricing.pro.features.1",
      "Homepage.pricing.pro.features.2",
      "Homepage.pricing.pro.features.3",
      "Homepage.pricing.pro.features.4",
      "Homepage.pricing.pro.features.5",
      "Homepage.pricing.pro.features.6",
    ] as const,
  },
} as const;

export const ALL_PLANS_INCLUDE = [
  "Homepage.pricing.allPlans.1",
  "Homepage.pricing.allPlans.2",
  "Homepage.pricing.allPlans.3",
] as const;
