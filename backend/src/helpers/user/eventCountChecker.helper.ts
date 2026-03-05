import { SUBSCRIPTION_LIMITS } from '../../../config/subscriptionLimits.config';
import { UserWithOtherDetails } from '../../types/prismaTypes';

export const eventCountChecker = (user: UserWithOtherDetails): boolean => {
  // Get users subscription tier
  const tier = user.billing?.subscription_tier;

  // If tier does not exist, throw err
  if (!tier) {
    throw new Error('Subscription tier missing');
  }

  // Get tier limits acc to the tier of user
  const tierLimits = SUBSCRIPTION_LIMITS[tier];

  // Get users events used
  const userEventCount = user.eventsUsed ?? 0;

  // If users event count >= max events limit, return true, else return false
  return userEventCount >= tierLimits.maxEvents;
};
