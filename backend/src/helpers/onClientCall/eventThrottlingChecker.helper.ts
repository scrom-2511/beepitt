import z from 'zod';
import { prisma } from '../../database/prismaClient';
import { ClientCallType } from '../../types/dataTypes';
import { Event, UserWithOtherDetails } from '../../types/prismaTypes';
import { generateHashKey } from './generateHashKey.helper';

type EventThrottlingResult =
  | { hasActiveEvent: true; sendNotification: boolean; event: Event }
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
  const userThrottlingWindow = user.projectSettings?.globalThrottleWindow! * 60 * 1000;

  // Get last notification sent time in milliseconds
  const lastNotificationSentTimeMs = event.lastNotificationSent.getTime();

  // Get current time in milliseconds
  const currentTimeMs = Date.now();

  // Determine whether the notification should be sent again based on the user-defined throttling time
  const cooldownExpired = currentTimeMs - lastNotificationSentTimeMs > userThrottlingWindow;

  // Return for "starter"
  if (user.billing?.subscription_tier === 'starter') {
    return { hasActiveEvent: true, sendNotification: cooldownExpired, event };
  }

  // If cooldown isn't expired, don't send notification
  if (!cooldownExpired) {
    return { hasActiveEvent: true, sendNotification: false, event };
  }

  // Get user trigger count
  const userTriggerCount = user.projectSettings?.eventTriggerCount || 1;

  // Get user trigger window
  const userTriggerWindowMs = user.projectSettings?.eventTriggerWindow || 1000;

  // Calculate time after first occurence
  const timeAfterFirstOccurence = currentTimeMs - event.firstOccurenceAfterLastNotificationSent!.getTime();

  // Check if occurences from last notification sent are greater than user-defined trigger count
  const userTriggerCountExceeded = event.occurrencesFromLastNotificationSent >= userTriggerCount;

  // Check if time after first occurence is greater than user-defined trigger window
  const userTriggerWindowExceeded = timeAfterFirstOccurence >= userTriggerWindowMs;

  // Check if the frequency exceeded
  const frequencyExceeded = userTriggerCountExceeded && userTriggerWindowExceeded;
  return { hasActiveEvent: true, sendNotification: frequencyExceeded, event };
};
