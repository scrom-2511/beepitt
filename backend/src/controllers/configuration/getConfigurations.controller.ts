import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const getConfigurationsController = async (req: Request, res: Response) => {
  try {
    // Get userId
    const userId = req.userId;

    if (!userId) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
      return;
    }

    // Fetch project settings
    const projectSettings = await prisma.configuration.findUnique({
      where: { userId },
      select: {
        globalThrottleWindow: true,
        eventTriggerCount: true,
        eventTriggerWindow: true,
        maxRetries: true,
        retryOffset: true,
        notificationChannels: true,
      },
    });

    // If not found → return default values (important edge case)
    if (!projectSettings) {
      successReturnCall(res, HttpStatus.OK, {
        globalThrottleWindow: 0,
        eventTriggerCount: 0,
        eventTriggerWindow: 0,
        maxRetries: 0,
        retryOffset: 0,
        notificationChannels: [],
      });
      return;
    }

    // Return response
    successReturnCall(res, HttpStatus.OK, {
      globalThrottleWindow: projectSettings.globalThrottleWindow,
      eventTriggerCount: projectSettings.eventTriggerCount,
      eventTriggerWindow: projectSettings.eventTriggerWindow,
      maxRetries: projectSettings.maxRetries,
      retryOffset: projectSettings.retryOffset,
      notificationChannels: projectSettings.notificationChannels,
    });
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
