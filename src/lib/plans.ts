export const PLANS = {
  free: {
    maxPublishedUpcoming: 1,
    maxAttendeesPerEvent: 50,
    maxTeamMembers: 1,
    embedBranding: true,
    customDomain: false,
    customRegistrationFields: false,
  },
  pro: {
    maxPublishedUpcoming: Infinity,
    maxAttendeesPerEvent: 100,
    maxTeamMembers: Infinity,
    embedBranding: false,
    customDomain: true,
    customRegistrationFields: true,
  },
} as const;

export type PlanId = keyof typeof PLANS;

export function getPlanLimits(plan: PlanId) {
  return PLANS[plan] ?? PLANS.free;
}
