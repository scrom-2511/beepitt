import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/prismaClient';
import { LoginType } from '../../types/dataTypes';
import { ERROR_CODES, HttpStatus } from '../../types/errorCodes';

export const signinController = async (req: Request, res: Response) => {
  try {
    const validateData = LoginType.safeParse(req.body);
    if (!validateData.success) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          id: ERROR_CODES.INVALID_INPUT.code,
          code: ERROR_CODES.INVALID_INPUT.code,
          message: ERROR_CODES.INVALID_INPUT.message,
        },
      });
      return;
    }

    const data = await prisma.user.findUnique({
      where: { email: validateData.data.email },
    });

    if (!data) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        error: {
          id: ERROR_CODES.USER_NOT_FOUND.id,
          code: ERROR_CODES.USER_NOT_FOUND.code,
          message: ERROR_CODES.USER_NOT_FOUND.message,
        },
      });
      return;
    }

    // if (data.otpVerified === false) {
    //   res.status(HttpStatus.UNAUTHORIZED).json({
    //     success: false,
    //     error: {
    //       id: ERROR_CODES.OTP_VERIFICATION_NEEDED.id,
    //       code: ERROR_CODES.OTP_VERIFICATION_NEEDED.code,
    //       message: ERROR_CODES.OTP_VERIFICATION_NEEDED.message,
    //     },
    //   });
    //   return;
    // }

    const isPasswordValid = await bcrypt.compare(
      validateData.data.password,
      data.password!,
    );

    if (!isPasswordValid) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: {
          id: ERROR_CODES.INCORRECT_PASSWORD.id,
          code: ERROR_CODES.INCORRECT_PASSWORD.code,
          message: ERROR_CODES.INCORRECT_PASSWORD.message,
        },
      });
      return;
    }

    const jwtPayload = { id: data.id };
    const jwtSecret = process.env.JWT_SECRET;

    const authToken = jwt.sign(jwtPayload, jwtSecret!, { expiresIn: '30d' });

    console.log('reached here');

    res
      .cookie('authToken', authToken, {
        httpOnly: true,
        secure: true, // REQUIRED
        sameSite: 'none', // REQUIRED for cross-site
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(HttpStatus.CREATED)
      .json({ success: true, data: { timeZone: data.timezone } });

    return;
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        id: ERROR_CODES.INTERNAL_SERVER_ERROR.id,
        code: ERROR_CODES.INTERNAL_SERVER_ERROR.code,
        message: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
      },
    });
    return;
  }
};
