import { SUBSCRIPTION_LIMITS } from '../../../config/subscriptionLimits.config';
import { Prisma, SubscriptionTier } from '../../../generated/prisma/client';

type UserWithDetails = Prisma.UserGetPayload<{
  include: { billing: true; project: true };
}>;

type EventTierLimitConfig = {
  maxEvents: number;
};

const EVENT_LIMITS_BY_TIER: Record<SubscriptionTier, EventTierLimitConfig> = {
  [SubscriptionTier.Free]: {
    maxEvents: SUBSCRIPTION_LIMITS.Free.maxEvents,
  },
  [SubscriptionTier.Starter]: {
    maxEvents: SUBSCRIPTION_LIMITS.Starter.maxEvents,
  },
  [SubscriptionTier.Pro]: {
    maxEvents: SUBSCRIPTION_LIMITS.Pro.maxEvents,
  },
} as const;

export const eventCountChecker = (user: UserWithDetails): boolean => {
  // Get users subscription tier
  const tier = user.billing?.subscription_tier;

  // If tier does not exist, throw err
  if (!tier) {
    throw new Error('Subscription tier missing');
  }

  // Get tier limits acc to the tier of user
  const tierLimits = EVENT_LIMITS_BY_TIER[tier];

  // Get users events used
  const userEventCount = user.eventsUsed ?? 0;

  // If users event count >= max events limit, return true, else return false
  return userEventCount >= tierLimits.maxEvents;
};
