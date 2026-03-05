import { Request, Response } from 'express';
import { prisma } from '../database/prismaClient';
import { billingChecker } from '../helpers/billing/billingChecker.helper';
import { enqueueNotificationsOnClientCall } from '../helpers/onClientCall/enqueueNotificationsOnClientCall.helper';
import { returnCallOnClientCall } from '../helpers/onClientCall/returnCallOnClientCall.helper';
import { getProjectByProjectName } from '../helpers/project/getProjectByProjectName.helper.';
import { notificationChannelChatIdsCheckerAndGetter } from '../helpers/project/notificationChannelChatIdsCheckerAndGetter.helper';
import { errorReturnCall } from '../helpers/returnCall/error.returnCall';
import { eventCountChecker } from '../helpers/user/eventCountChecker.helper';
import { getSelectedNotificationChannelsOfUser } from '../helpers/user/getSelectedNotificationChannelsOfUser.helper';
import { onClientIncidentType } from '../types/dataTypes';
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

    // Get project name from the req body
    const projectName = validateData.data.projectName;

    // Check if the project with project name exists or not
    const projectExists = getProjectByProjectName(projectName, user);

    // If project does not exist, return
    if (!projectExists) {
      errorReturnCall(res, HttpStatus.NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND);
      return;
    }

    // Check if the user exceeds his user count limit
    const eventCountExceeds = eventCountChecker(user);

    // If he exceeds, return
    if (eventCountExceeds) {
      return errorReturnCall(res, HttpStatus.CONFLICT, ErrorCode.EVENTS_LIMIT_REACHED);
    }

    // Check and get the notification channel's chat ids
    const allChatIdsInfo = notificationChannelChatIdsCheckerAndGetter(validateData.data.projectName, user);

    // Get selected notification channels of user
    const channels = getSelectedNotificationChannelsOfUser(user);

    // Enqueue notifications
    await enqueueNotificationsOnClientCall(userId, channels, allChatIdsInfo);

    // Create an incident in the db
    await prisma.incident.create({
      data: { ...validateData.data, userId },
    });

    // Increase events used of user by 1
    await prisma.user.update({ where: { id: userId }, data: { eventsUsed: { increment: 1 } } });

    // Return to user
    returnCallOnClientCall(res, allChatIdsInfo);
    return;
  } catch (error) {
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
