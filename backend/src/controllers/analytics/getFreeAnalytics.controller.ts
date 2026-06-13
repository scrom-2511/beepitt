import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { HttpStatus } from '../../types/errorCodes';
import { SUBSCRIPTION_LIMITS } from '../../../config/subscriptionLimits.config';

export const getFreeAnalytics = async (req: Request, res: Response, userId: number, tier: string) => {
  const configuration = await prisma.configuration.findUnique({
    where: { userId },
  });
  const used = configuration?.eventsUsed ?? 0;
  const limit = SUBSCRIPTION_LIMITS.free.maxEvents;

  successReturnCall(res, HttpStatus.OK, {
    tier,
    used,
    limit,
    incidents: 0,
    issues: 0,
    topProject: {
      topIncidentProject: null,
      topIncidentCount: 0,
      topIssuesProject: null,
      topIssuesCount: 0,
    },
  });
  return;
};
