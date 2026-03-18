import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { UpdateGlobalThrottleWindowType } from '../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const updateGlobalThrottleWindowController = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validateData = UpdateGlobalThrottleWindowType.safeParse(req.body);

    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    const userId = req.userId;

    if (!userId) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
      return;
    }

    // Check if configuration exists
    const config = await prisma.configuration.findUnique({
      where: { userId },
    });

    if (!config) {
      errorReturnCall(res, HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND);
      return;
    }

    // Update globalThrottleWindow
    await prisma.configuration.update({
      where: { userId },
      data: {
        globalThrottleWindow: validateData.data.globalThrottleWindow,
      },
    });

    successReturnCall(res, HttpStatus.OK, {
      globalThrottleWindow: validateData.data.globalThrottleWindow,
    });
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
