import { Request, Response } from 'express';
import { prisma } from '../../../database/prismaClient';
import { ERROR_CODES, HttpStatus } from '../../../types/errorCodes';

export const getAllUnseenIncidentsController = async (
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

    const PAGE_SIZE = 10;
    const lastId = req.query.lastId ? Number(req.query.lastId) : undefined;

    const incidents = await prisma.incident.findMany({
      where: { userId, incidentSeen: false },
      orderBy: [{ incidentSeenDateAndTime: 'desc' }, { id: 'desc' }],
      take: PAGE_SIZE,
      ...(lastId && {
        cursor: { id: lastId },
        skip: 1,
      }),
    });

    res.status(HttpStatus.OK).json({
      success: true,
      data: incidents,
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
