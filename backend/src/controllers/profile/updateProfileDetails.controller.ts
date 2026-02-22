import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { ProfileUpdateType } from '../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const updateProfileDetailsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validateData = ProfileUpdateType.safeParse(req.body);
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        firstName: validateData.data.firstName,
        lastName: validateData.data.lastName,
      },
    });

    successReturnCall(res, HttpStatus.OK, null);
    return;
  } catch (error) {
    console.log(error);
    errorReturnCall(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_SERVER_ERROR,
    );
    return;
  }
};
