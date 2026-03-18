import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { sendOTPEmail } from '../../services/mailgun/sendOtpMail';
import { setOtp } from '../../services/redis/otpManager.redis';
import { SignupType } from '../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const signupController = async (req: Request, res: Response) => {
  try {
    const validateData = SignupType.safeParse(req.body);
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    const data = await prisma.user.findUnique({
      where: { email: validateData.data.email },
    });

    if (data) {
      errorReturnCall(res, HttpStatus.CONFLICT, ErrorCode.DATA_ALREADY_EXISTS);
      return;
    }

    const hashedPassword = await bcrypt.hash(validateData.data.password, 10);
    const validTill = new Date();
    validTill.setUTCDate(validTill.getUTCDate() + 30);

    const newUser = await prisma.user.create({
      data: {
        email: validateData.data.email,
        username: validateData.data.username,
        timezone: validateData.data.timezone,
        password: hashedPassword,
        billing: {
          create: {
            currentStatus: 'active',
            subscription_tier: 'free',
            validTill: validTill,
          },
        },
        emailVerified: false,
        configuration: {
          create: {
            eventsUsed: 0,
            eventTriggerCount: 0,
            eventTriggerWindow: 0,
            globalThrottleWindow: 0,
            maxRetries: 0,
            retryOffset: 0,
            notificationChannels: [],
          },
        },
      },
    });

    const newOtp = crypto.randomInt(1000, 10000);

    await setOtp(newOtp.toString(), newUser.id);

    await sendOTPEmail(validateData.data.email, newOtp);

    const jwtPayload = { id: newUser.id, email: newUser.email };

    const authToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!);

    res
      .cookie('authToken', authToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(HttpStatus.CREATED)
      .json({ success: true });

    return;
  } catch (error) {
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
