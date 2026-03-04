import { Request, Response } from 'express';
import { prisma } from '../database/prismaClient';
import { billingChecker } from '../helpers/billing/billingChecker.helper';
import { eventCountChecker } from '../helpers/onClientCall/eventCountChecker.helper';
import { notificationChannelChatIdsCheckerAndGetter } from '../helpers/onClientCall/notificationChannelChatIdsCheckerAndGetter.helper';
import { projectExistsChecker } from '../helpers/onClientCall/projectExistsChecker.helper';
import { errorReturnCall } from '../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../helpers/returnCall/success.returnCall';
import { enqueueDiscordNotifications } from '../services/bullmq/producers/discordNotifications.producer';
import { enqueueTelegramNotifications } from '../services/bullmq/producers/telegramNotifications.producer';
import { NotificationType, onClientIncidentType } from '../types/dataTypes';
import { ErrorCode, HttpStatus } from '../types/errorCodes';

export const onClientIncidentWebhook = async (req: Request, res: Response) => {
  try {
    const validateData = onClientIncidentType.safeParse(req.body);

    // Validate the req body
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    // Get user's id
    const userId = req.userId!;

    // Get project name from the req body
    const projectName = validateData.data.projectName;

    // Check if the project with project name exists or not
    const projectExists = await projectExistsChecker(projectName, userId);

    // If project does not exist, return
    if (!projectExists) {
      errorReturnCall(res, HttpStatus.NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND);
      return;
    }

    // Check the billing of user, basically it checks whether users paid plan has expired or not
    await billingChecker(userId);

    // Get the user along with billing, project and contactDetails
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { billing: true, project: { include: { contactDetails: true } } },
    });

    // If user does not exist return
    if (!user) {
      return errorReturnCall(res, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
    }

    // Check if the user exceeds his user count limit
    const eventCountExceeds = eventCountChecker(user);

    // If he exceeds, return
    if (eventCountExceeds) {
      return errorReturnCall(res, HttpStatus.CONFLICT, ErrorCode.EVENTS_LIMIT_REACHED);
    }

    // Check and get the notification channel's chat ids
    const { discordChatIdsPresent, telegramChatIdsPresent, discordChatIds, telegramChatIds } =
      await notificationChannelChatIdsCheckerAndGetter(validateData.data.projectName, user);

    // If discord chat ids are present, enqueue the discord notification
    if (discordChatIdsPresent) {
      await enqueueDiscordNotifications({ userId, data: discordChatIds, type: NotificationType.Incident });
    }

    // If telegram chat ids are present, enqueue the telegram notification
    if (telegramChatIdsPresent) {
      await enqueueTelegramNotifications({ userId, data: telegramChatIds, type: NotificationType.Incident });
    }

    // Create an incident in the db
    await prisma.incident.create({
      data: { ...validateData.data, userId },
    });

    // Increase events used of user by 1
    await prisma.user.update({ where: { id: userId }, data: { eventsUsed: { increment: 1 } } });

    // If no notification channel is linked, return
    if (!discordChatIdsPresent && !telegramChatIdsPresent) {
      errorReturnCall(res, HttpStatus.CONFLICT, ErrorCode.NO_NOTIFICATION_CHANNEL_LINKED);
    } else {
      // Else return success
      successReturnCall(res, HttpStatus.OK, null);
    }

    return;
  } catch (error) {
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};