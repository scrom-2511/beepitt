import { Request, Response } from 'express';
import { json2csv } from 'json-2-csv';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { sendLogs } from '../../services/mailgun/sendLogs.mailgun';
import { ExportLogsType } from '../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';
import { formatDateInTimeZone } from '../../utils/formatDateInTimeZone.util';

export const exportLogsController = async (req: Request, res: Response) => {
  try {
    // Validate the data
    const validateData = ExportLogsType.safeParse(req.body);

    // Return if validation fails
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    // Get users id
    const userId = req.userId;

    // If id does not exist, return
    if (!userId) {
      errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, include: { billing: true } });

    if (user!.billing?.subscription_tier === 'free') {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.OPERATION_NOT_ALLOWED);
      return;
    }

    const tier = user?.billing?.subscription_tier;

    const incidentLogs = await prisma.event.findMany({
      where: { userId, type: 'incident' },
      select: {
        id: true,
        name: true,
        description: true,
        projectName: true,
        environment: true,
        filePath: true,
        occurrences: true,
        createdAt: true,
        seenAt: true,
        ...(tier === 'pro' && { group: true }),
      },
    });

    const issueLogs = await prisma.event.findMany({
      where: { userId, type: 'issue' },
      select: {
        id: true,
        name: true,
        description: true,
        projectName: true,
        environment: true,
        filePath: true,
        lineNumber: true,
        columnNumber: true,
        occurrences: true,
        createdAt: true,
        resolvedAt: true,
        priority: true,
        ...(tier === 'pro' && { group: true }),
      },
    });

    const timezone = user?.timezone!;

    const formattedIncidentLogs = incidentLogs.map((log) => ({
      ...log,
      createdAt: log.createdAt ? formatDateInTimeZone(log.createdAt, timezone) : null,
      seenAt: log.seenAt ? formatDateInTimeZone(log.seenAt, timezone) : null,
    }));

    const formattedIssueLogs = issueLogs.map((log) => ({
      ...log,
      createdAt: log.createdAt ? formatDateInTimeZone(log.createdAt, timezone) : null,
      seenAt: log.resolvedAt ? formatDateInTimeZone(log.resolvedAt, timezone) : null,
    }));

    if (validateData.data.exportType === 'csv') {
      const formattedIncidentLogsCSV = json2csv(formattedIncidentLogs);
      const formattedIssueLogsCSV = json2csv(formattedIssueLogs);
      await sendLogs(formattedIncidentLogsCSV, formattedIssueLogsCSV, user?.email!, validateData.data.exportType);
      return;
    }

    await sendLogs(
      JSON.stringify(formattedIncidentLogs),
      JSON.stringify(formattedIssueLogs),
      user?.email!,
      validateData.data.exportType,
    );
  } catch (error) {}
};
