import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { HttpStatus } from '../../types/errorCodes';

// Currently, the analytics is done by taking whole data at once and a loop in the frontend, but with the increase in users, switch to db analytics
export const getAnalyticsOfUser = async (req: Request, res: Response) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);

    const lastSevenDaysEvents = await prisma.event.findMany({
      where: {
        userId: req.userId,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: { type: true, priority: true, createdAt: true, resolvedAt: true, seenAt: true, projectName: true },
    });

    successReturnCall(res, HttpStatus.OK, lastSevenDaysEvents);
  } catch (error) {
    
  }
};
