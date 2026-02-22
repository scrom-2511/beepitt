import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../database/prismaClient';
import { sendOTPEmail } from '../../services/mailgun/sendOtpMail';
import { setOtp } from '../../services/redis/otpManager.redis';
import { SignupType } from '../../types/dataTypes';
import { ERROR_CODES, HttpStatus } from '../../types/errorCodes';

export const signupController = async (req: Request, res: Response) => {
  try {
    const validateData = SignupType.safeParse(req.body);
    if (!validateData.success) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          code: ERROR_CODES.INVALID_INPUT.code,
          message: ERROR_CODES.INVALID_INPUT.message,
        },
      });
      return;
    }

    const data = await prisma.user.findUnique({
      where: { email: validateData.data.email },
    });

    if (data) {
      res.status(HttpStatus.CONFLICT).json({
        success: false,
        error: {
          code: ERROR_CODES.DATA_ALREADY_EXISTS.code,
          message: ERROR_CODES.DATA_ALREADY_EXISTS.message,
        },
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(validateData.data.password, 10);

    const identifierKey = uuidv4();

    const newUser = await prisma.user.create({
      data: {
        email: validateData.data.email,
        username: validateData.data.username,
        timezone: validateData.data.timezone,
        password: hashedPassword,
        identifierKey,
        billing: {
          create: {
            currentStatus: 'Active',
            subscription_tier: 'Free',
            validTill: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          },
        },
        emailVerified: false,
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
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR.code,
        message: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
      },
    });
    return;
  }
};
