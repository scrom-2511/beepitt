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
  const tier = user.billing?.subscription_tier;

  if (!tier) {
    throw new Error('Subscription tier missing');
  }

  const tierLimits = EVENT_LIMITS_BY_TIER[tier];

  const userEventCount = user.eventsUsed ?? 0;

  return userEventCount >= tierLimits.maxEvents;
};
