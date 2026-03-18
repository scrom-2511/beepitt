import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { verifyOtp } from '../../services/redis/otpManager.redis';
import { OtpValidateType } from '../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const otpValidateController = async (req: Request, res: Response) => {
  try {
    const validateData = OtpValidateType.safeParse(req.body);
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    const isValid = await verifyOtp(req.userId!, validateData.data.otp);

    if (!isValid) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.INVALID_OTP);
      return;
    }

    await prisma.user.update({
      where: { id: req.userId },
      data: { emailVerified: true },
    });

    successReturnCall(res, HttpStatus.OK, null);
    return;
  } catch (error) {
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
