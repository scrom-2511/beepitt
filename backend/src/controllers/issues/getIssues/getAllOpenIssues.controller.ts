import { Request, Response } from 'express';
import { prisma } from '../../../database/prismaClient';
import { ERROR_CODES, HttpStatus } from '../../../types/errorCodes';

export const getAllOpenIssuesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: {
          id: ERROR_CODES.UNAUTHORIZED.id,
          code: ERROR_CODES.UNAUTHORIZED.code,
          message: ERROR_CODES.UNAUTHORIZED.message,
        },
      });
      return;
    }

    const allErrors = await prisma.issue.findMany({
      where: {
        userId,
        issuePriority: {
          notIn: ['Unseen', 'Closed'],
        },
      },
    });

    res.status(HttpStatus.OK).json({
      success: true,
      data: allErrors,
    });
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
