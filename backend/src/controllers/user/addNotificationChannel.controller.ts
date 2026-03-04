import { Request, Response } from 'express';
import { SUBSCRIPTION_LIMITS } from '../../../config/subscriptionLimits.config';
import { NotificationChannels } from '../../../generated/prisma/enums';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { AddNotificationChannel } from '../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const addNotificationChannelController = async (req: Request, res: Response) => {
  try {
    // Validate the data
    const validateData = AddNotificationChannel.safeParse(req.body);

    // Return if validation fails
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    // Get users id
    const userId = req.userId;

    // If id does not exist, return
    if (!userId) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, include: { billing: true } });

    // If user does not exist return
    if (!user) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
      return;
    }

    // Get users subscription tier
    const userSubscriptionTier = user.billing?.subscription_tier;

    // Get max notification channels limit acc to the subscription tier
    const maxNotificationChannelsLimit = SUBSCRIPTION_LIMITS[userSubscriptionTier!].maxNotificationChannels;

    // Get users notification channels
    const userNotificationChannels = user.notificationChannels;

    // If users notification channel length >= max notification channel limit return
    if (userNotificationChannels.length >= maxNotificationChannelsLimit) {
      errorReturnCall(res, HttpStatus.CONFLICT, ErrorCode.NOTIFICATION_CHANNEL_LIMIT_REACHED_FREE);
      return;
    }

    // Array to store the channels which we have to add
    const notificationChannelsToAdd: NotificationChannels[] = [];

    // Remaining limit of channels
    const remainingLimit = maxNotificationChannelsLimit - userNotificationChannels.length;

    for (const channel of validateData.data.channels) {
      // If notificationChannelsToAdd ?= remaining limit, break
      if (notificationChannelsToAdd.length >= remainingLimit) {
        break;
      }

      // Only add a channel if it does not already exist
      if (!userNotificationChannels.includes(channel)) {
        notificationChannelsToAdd.push(channel);
      }
    }

    // Only hit the DB if there are actually new channels to add
    if (notificationChannelsToAdd.length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          notificationChannels: {
            push: notificationChannelsToAdd,
          },
        },
      });
    }

    successReturnCall(res, HttpStatus.OK, null);
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
