import { SUBSCRIPTION_LIMITS } from '../../../config/subscriptionLimits.config';
import { NotificationChannels } from '../../../generated/prisma/enums';
import { UserWithOtherDetails } from '../../types/prismaTypes';

export const getSelectedNotificationChannelsOfUser = (user: UserWithOtherDetails): NotificationChannels[] => {
  // Get all selected notification channels of user
  const selectedNotificationChannels = user.notificationChannels;

  // Get users subscription tier
  const tier = user.billing?.subscription_tier!;

  // Get max notification channels limit acc to users subscription tier
  const maxNotificationChannels = SUBSCRIPTION_LIMITS[tier].maxNotificationChannels;

  // Get notification channels according to users subscription limit
  const notificationChannels = selectedNotificationChannels.slice(0, maxNotificationChannels);

  // Return notification channels
  return notificationChannels;
};
