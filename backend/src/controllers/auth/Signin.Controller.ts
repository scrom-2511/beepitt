import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { LoginType } from '../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const signinController = async (req: Request, res: Response) => {
  try {
    const validateData = LoginType.safeParse(req.body);
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    const data = await prisma.user.findUnique({
      where: { email: validateData.data.email },
    });

    if (!data) {
      errorReturnCall(res, HttpStatus.NOT_FOUND, ErrorCode.USER_NOT_FOUND);
      return;
    }

    const isPasswordValid = await bcrypt.compare(validateData.data.password, data.password!);

    if (!isPasswordValid) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.USER_NOT_FOUND);
      return;
    }

    const jwtPayload = { id: data.id };
    const jwtSecret = process.env.JWT_SECRET;

    const authToken = jwt.sign(jwtPayload, jwtSecret!, { expiresIn: '30d' });

    res
      .cookie('authToken', authToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      })
      .status(HttpStatus.CREATED)
      .json({ success: true, data: { timeZone: data.timezone } });

    return;
  } catch (error) {
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
