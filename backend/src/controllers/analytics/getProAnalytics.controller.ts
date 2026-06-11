import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { HttpStatus } from '../../types/errorCodes';

export const getProAnalytics = async (req: Request, res: Response, userId: number, tier: string) => {
  const [configuration, incidentsCount, issuesCount] = await Promise.all([
    prisma.configuration.findUnique({ where: { userId } }),
    prisma.event.count({ where: { userId, type: 'incident' } }),
    prisma.event.count({ where: { userId, type: 'issue' } }),
  ]);

  const used = configuration?.eventsUsed ?? 0;
  const limit = configuration?.globalThrottleWindow ?? 10000;

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

  const response: any = {
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
  };

  // 1. Priority distribution
  const priorityDistributionRaw = await prisma.event.groupBy({
    by: ['priority'],
    where: { userId },
    _count: { priority: true },
  });
  response.priorityDistribution = priorityDistributionRaw.map(item => ({
    priority: item.priority || 'unseen',
    count: item._count.priority,
  }));

  // 2. Environment breakdown
  const environmentBreakdownRaw = await prisma.event.groupBy({
    by: ['environment'],
    where: { userId },
    _count: { environment: true },
  });
  response.environmentBreakdown = environmentBreakdownRaw.map(item => ({
    environment: item.environment,
    count: item._count.environment,
  }));

  // 3. Trends: last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
  const trendsResult = await prisma.$queryRaw<[{ date: string; incident_count: bigint; issue_count: bigint }]>`
    SELECT DATE("createdAt") as "date",
           SUM(CASE WHEN "type" = 'incident' THEN 1 ELSE 0 END) as "incident_count",
           SUM(CASE WHEN "type" = 'issue' THEN 1 ELSE 0 END) as "issue_count"
    FROM "Event"
    WHERE "userId" = ${userId} AND "createdAt" >= ${thirtyDaysAgo}
    GROUP BY DATE("createdAt")
    ORDER BY "date" ASC
  `;
  response.trends = {
    last30Days: trendsResult.map(item => ({ 
      date: item.date, 
      incidentCount: Number(item.incident_count),
      issueCount: Number(item.issue_count)
    })),
  };

  // 4. Most Frequent Event
  const mostFrequentRaw = await prisma.event.findFirst({
    where: { userId },
    orderBy: { occurrences: 'desc' },
  });
  if (mostFrequentRaw) {
    response.mostFrequentEvent = {
        name: mostFrequentRaw.name,
        type: mostFrequentRaw.type,
        occurrences: mostFrequentRaw.occurrences,
        projectName: mostFrequentRaw.projectName,
    };
  } else {
    response.mostFrequentEvent = null;
  }

  // 5. Avg Resolution Time for Issues (in minutes)
  const resolvedIssues = await prisma.event.findMany({
    where: { userId, type: 'issue', resolvedAt: { not: null } },
    select: { createdAt: true, resolvedAt: true },
  });
  if (resolvedIssues.length > 0) {
    const totalMs = resolvedIssues.reduce((acc, event) => {
       const ms = event.resolvedAt!.getTime() - event.createdAt.getTime();
       return acc + Math.max(0, ms);
    }, 0);
    response.avgResolutionTimeMinutes = Math.round((totalMs / resolvedIssues.length) / 60000);
  } else {
    response.avgResolutionTimeMinutes = 0;
  }

  successReturnCall(res, HttpStatus.OK, response);
  return;
};
