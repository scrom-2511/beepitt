import { SUBSCRIPTION_LIMITS } from '../../../config/subscriptionLimits.config';
import { NotificationChannels } from '../../../generated/prisma/enums';
import { UserWithBillingConfigurationProjectContactDetails } from '../../types/prismaTypes';

export const getSelectedNotificationChannelsOfUser = (
  user: UserWithBillingConfigurationProjectContactDetails,
): NotificationChannels[] => {
  // Get all selected notification channels of user
  const selectedNotificationChannels = user.configuration?.notificationChannels;

  // Get users subscription tier
  const tier = user.billing?.subscription_tier!;

  // Get max notification channels limit acc to users subscription tier
  const maxNotificationChannels = SUBSCRIPTION_LIMITS[tier].maxNotificationChannels;

  // Get and return notification channels according to users subscription limit
  return selectedNotificationChannels?.slice(0, maxNotificationChannels) || [];
};
