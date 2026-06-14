import { Request, Response } from 'express';
import { prisma } from '../../../database/prismaClient';
import { errorReturnCall } from '../../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../../helpers/returnCall/success.returnCall';
import { discordNotificationsQueue } from '../../../services/bullmq/queues/discordNotifications.queue';
import { telegramNotificationsQueue } from '../../../services/bullmq/queues/telegramNotifications.queue';
import { UpdateIncidentSeenType } from '../../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../../types/errorCodes';

export const updateIncidentSeenController = async (req: Request, res: Response) => {
  try {
    const validateData = UpdateIncidentSeenType.safeParse(req.body);
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    await prisma.event.update({
      where: { id: validateData.data.incidentId },
      data: {
        seenAt: new Date(),
      },
    });

    const user = await prisma.user.findFirst({
      where: { id: req.userId },
      include: { billing: true, configuration: true },
    });

    if (!user) {
      return;
    }

    let maxRetries = user.configuration?.maxRetries || 0;

    const removeItems: Promise<number>[] = [];

    if (user.billing?.subscription_tier === 'pro') {
      const initialJobId = `${validateData.data.incidentId}`;
      removeItems.push(discordNotificationsQueue.remove(initialJobId));
      removeItems.push(telegramNotificationsQueue.remove(initialJobId));

      for (let retry = 1; retry <= maxRetries; retry++) {
        const jobId = `${validateData.data.incidentId}-retry-${retry}`;
        removeItems.push(discordNotificationsQueue.remove(jobId));
        removeItems.push(telegramNotificationsQueue.remove(jobId));
      }
    }

    await Promise.all(removeItems);

    successReturnCall(res, HttpStatus.OK, null);
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
  }
};
