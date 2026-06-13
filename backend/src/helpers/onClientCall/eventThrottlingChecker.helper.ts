import z from 'zod';
import { prisma } from '../../database/prismaClient';
import { ClientCallType } from '../../types/dataTypes';
import { Event, UserWithBillingConfigurationProjectContactDetails } from '../../types/prismaTypes';
import { generateHashKey } from './generateHashKey.helper';

type EventThrottlingResult =
  | { hasActiveEvent: true; sendNotification: boolean; event: Event }
  | { hasActiveEvent: false; sendNotification: true };

export const eventThrottlingChecker = async (
  user: UserWithBillingConfigurationProjectContactDetails,
  eventData: z.infer<typeof ClientCallType>,
): Promise<EventThrottlingResult> => {
  // If subscription tier is free, we will send notification, as free tier doesnot support throttling
  if (user.billing?.subscription_tier === 'free') {
    return { hasActiveEvent: false, sendNotification: true };
  }

  // Generate event hash key
  const generatedHashKey = generateHashKey(eventData);

  // Get the event from database
  const event = await prisma.event.findFirst({
    where: {
      eventHashKey: generatedHashKey,
      ...(eventData.type === 'incident' ? { seenAt: null } : { resolvedAt: null }),
    },
  });

  // If event does not exist, return
  if (!event) {
    return { hasActiveEvent: false, sendNotification: true };
  }

  // Get users throttling time in milliseconds
  const userThrottlingWindow = user.configuration?.globalThrottleWindow! * 60 * 1000;

  // Get last notification sent time in milliseconds
  const lastNotificationSentTimeMs = event.lastNotificationSent.getTime();

  // Get current time in milliseconds
  const currentTimeMs = Date.now();

  // Determine whether the notification should be sent again based on the user-defined throttling time
  const cooldownExpired = currentTimeMs - lastNotificationSentTimeMs > userThrottlingWindow;

  // Return for "starter" and "pro"
  return { hasActiveEvent: true, sendNotification: cooldownExpired, event };

};
