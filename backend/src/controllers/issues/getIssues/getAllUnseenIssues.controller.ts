import { Request, Response } from 'express';
import { prisma } from '../../../database/prismaClient';
import { errorReturnCall } from '../../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../../helpers/returnCall/success.returnCall';
import { ErrorCode, HttpStatus } from '../../../types/errorCodes';

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

    successReturnCall(res, HttpStatus.OK, { issues, nextCursor });
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_SERVER_ERROR,
    );
    return;
  }
};
