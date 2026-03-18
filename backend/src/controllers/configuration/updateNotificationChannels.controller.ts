import { Request, Response } from 'express';
import { SUBSCRIPTION_LIMITS } from '../../../config/subscriptionLimits.config';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { UpdateNotificationChannelsType } from '../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const updateNotificationChannelsController = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validateData = UpdateNotificationChannelsType.safeParse(req.body);

    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    const { channels } = validateData.data;

    // Get userId
    const userId = req.userId;

    if (!userId) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
      return;
    }

    // Fetch user with billing + projectSettings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { billing: true, configuration: true },
    });

    if (!user) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
      return;
    }

    // Get subscription tier
    const userSubscriptionTier = user.billing?.subscription_tier;

    if (!userSubscriptionTier) {
      errorReturnCall(res, HttpStatus.CONFLICT, ErrorCode.UNAUTHORIZED);
      return;
    }

    // Get max allowed channels
    const maxChannelsLimit = SUBSCRIPTION_LIMITS[userSubscriptionTier].maxNotificationChannels;

    // Enforce limit
    if (channels.length > maxChannelsLimit) {
      errorReturnCall(res, HttpStatus.CONFLICT, ErrorCode.LIMIT_EXCEEDED);
      return;
    }

    // If projectSettings does not exist → create
    if (!user.configuration) {
      await prisma.configuration.create({
        data: {
          userId,
          eventsUsed: 0,
          globalThrottleWindow: 0,
          eventTriggerCount: 0,
          eventTriggerWindow: 0,
          maxRetries: 0,
          retryOffset: 0,
          notificationChannels: channels,
        },
      });
    } else {
      // Else update
      await prisma.configuration.update({
        where: { userId },
        data: {
          notificationChannels: channels,
        },
      });
    }

    successReturnCall(res, HttpStatus.OK, {
      notificationChannels: channels,
    });
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
