import crypto from 'crypto';
import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { sendOTPEmail } from '../../services/mailgun/sendOtpMail';
import { setOtp } from '../../services/redis/otpManager.redis';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const otpSenderController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { email: true, id: true },
    });

    if (!user) {
      errorReturnCall(res, HttpStatus.NOT_FOUND, ErrorCode.USER_NOT_FOUND);
      return;
    }

    const newOtp = crypto.randomInt(1000, 10000);

    await setOtp(newOtp.toString(), user.id);

    await sendOTPEmail(user.email, newOtp);

    successReturnCall(res, HttpStatus.OK, { message: 'OTP sent successfully' });
    return;
  } catch (error) {
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
