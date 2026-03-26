import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const getAllGroupsController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const rows = await prisma.event.findMany({
      where: {
        userId,
        group: { not: null },
      },
      select: { group: true },
      distinct: ['group'],
      orderBy: { group: 'asc' },
    });

    const groups = rows.map((r) => r.group as string);

    successReturnCall(res, HttpStatus.OK, { groups });
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
