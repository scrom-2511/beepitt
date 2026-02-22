import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { TimeZoneAndPreferencesUpdateType } from '../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const updateTimeZoneAndPreferencesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validateData = TimeZoneAndPreferencesUpdateType.safeParse(req.body);
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: validateData.data,
    });

    successReturnCall(res, HttpStatus.OK, null);
    return;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    errorReturnCall(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_SERVER_ERROR,
    );
    return;
  }
};
