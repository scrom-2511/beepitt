import { Request, Response } from 'express';
import { prisma } from '../../../database/prismaClient';
import { ERROR_CODES, HttpStatus } from '../../../types/errorCodes';

export const getAllUnseenIssuesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.userId;

    const PAGE_SIZE = 10;
    const lastId = Number(req.query.lastId);

    const issues = await prisma.issue.findMany({
      where: {
        userId,
        issuePriority: 'Unseen',
      },
      orderBy: { id: 'desc' },
      ...(lastId && {
        cursor: { id: lastId },
        skip: 1,
      }),
      take: PAGE_SIZE,
    });

    const nextCursor =
      issues.length === PAGE_SIZE ? issues[issues.length - 1].id : null;

    res.status(HttpStatus.OK).json({
      success: true,
      data: { issues, nextCursor },
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
