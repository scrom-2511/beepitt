import { NextFunction, Request, Response } from 'express';
import { prisma } from '../database/prismaClient';
import { errorReturnCall } from '../helpers/returnCall/error.returnCall';
import { ErrorCode, HttpStatus } from '../types/errorCodes';

export const isVerified = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { emailVerified: true },
    });

    if (!user) {
      errorReturnCall(res, HttpStatus.NOT_FOUND, ErrorCode.USER_NOT_FOUND);
      return;
    }

    if (!user.emailVerified) {
      errorReturnCall(res, HttpStatus.FORBIDDEN, ErrorCode.OTP_VERIFICATION_NEEDED);
      return;
    }

    next();
  } catch (error) {
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
