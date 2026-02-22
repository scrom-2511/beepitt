import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const getProfileDetailsAndPreferncesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.userId;

    const profileDetailsAndPrefernces = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        city: true,
        timezone: true,
      },
    });

    successReturnCall(res, HttpStatus.OK, profileDetailsAndPrefernces);
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_SERVER_ERROR,
    );
    return;
  }
};
