import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { HttpStatus } from '../../types/errorCodes';

export const getStarterAnalytics = async (req: Request, res: Response, userId: number, tier: string) => {
  const configuration = await prisma.configuration.findUnique({
    where: { userId },
  });
  const used = configuration?.eventsUsed ?? 0;
  const limit = configuration?.globalThrottleWindow ?? 10000;

  const incidentsCount = await prisma.event.count({
    where: { userId, type: 'incident' },
  });

  const issuesCount = await prisma.event.count({
    where: { userId, type: 'issue' },
  });

  const topIncidentProjectResult = await prisma.event.groupBy({
    by: ['projectName'],
    where: { userId, type: 'incident' },
    _count: { projectName: true },
    orderBy: { _count: { projectName: 'desc' } },
    take: 1,
  });

  const topIssuesProjectResult = await prisma.event.groupBy({
    by: ['projectName'],
    where: { userId, type: 'issue' },
    _count: { projectName: true },
    orderBy: { _count: { projectName: 'desc' } },
    take: 1,
  });

  successReturnCall(res, HttpStatus.OK, {
    tier,
    used,
    limit,
    incidents: incidentsCount,
    issues: issuesCount,
    topProject: {
      topIncidentProject: topIncidentProjectResult[0]?.projectName ?? null,
      topIncidentCount: topIncidentProjectResult[0]?._count.projectName ?? 0,
      topIssuesProject: topIssuesProjectResult[0]?.projectName ?? null,
      topIssuesCount: topIssuesProjectResult[0]?._count.projectName ?? 0,
    },
  });
  return;
};
