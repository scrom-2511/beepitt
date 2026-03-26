import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';
import { getFreeAnalytics } from './getFreeAnalytics.controller';
import { getProAnalytics } from './getProAnalytics.controller';
import { getStarterAnalytics } from './getStarterAnalytics.controller';

export const getAnalyticsDataController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
      return;
    }

    const billing = await prisma.billing.findUnique({
      where: { userId },
    });
    const tier = billing?.subscription_tier ?? 'free'; // 'free', 'starter', 'pro'

    if (tier === 'free') {
      return await getFreeAnalytics(req, res, userId, tier);
    } else if (tier === 'starter') {
      return await getStarterAnalytics(req, res, userId, tier);
    } else if (tier === 'pro') {
      return await getProAnalytics(req, res, userId, tier);
    } else {
      return await getFreeAnalytics(req, res, userId, 'free');
    }
  } catch (error) {
    console.error(error);
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
