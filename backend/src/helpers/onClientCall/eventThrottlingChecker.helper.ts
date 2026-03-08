import z from 'zod';
import { prisma } from '../../database/prismaClient';
import { ClientCallType } from '../../types/dataTypes';
import { UserWithOtherDetails } from '../../types/prismaTypes';
import { generateHashKey } from './generateHashKey.helper';

type EventThrottlingResult =
  | { hasActiveEvent: true; sendNotification: boolean; eventId: number }
  | { hasActiveEvent: false; sendNotification: true };

export const eventThrottlingChecker = async (
  user: UserWithOtherDetails,
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
  const userThrottlingTimeInMilliseconds = user.projectSettings?.throttlingTime! * 60 * 1000;

  // Get last notification sent time in milliseconds
  const lastNotificationSentTimeInMilliseconds = new Date(event.lastNotificationSent).getTime();

  // Get current time in milliseconds
  const currentTimeInMilliseconds = Date.now();

  // Determine whether the notification should be sent again based on the user-defined throttling time
  const shouldSendNotification =
    currentTimeInMilliseconds - lastNotificationSentTimeInMilliseconds > userThrottlingTimeInMilliseconds;

  // Return the result
  return { hasActiveEvent: true, sendNotification: shouldSendNotification, eventId: event.id };
};