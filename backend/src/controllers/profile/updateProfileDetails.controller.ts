import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { ProfileUpdateType } from '../../types/dataTypes';
import { ERROR_CODES, HttpStatus } from '../../types/errorCodes';

export const updateProfileDetailsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validateData = ProfileUpdateType.safeParse(req.body);
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

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        firstName: validateData.data.firstName,
        lastName: validateData.data.lastName,
      },
    });

    res.status(HttpStatus.OK).json({
      success: true,
    });
    return;
  } catch (error) {
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
