import { Request, Response } from 'express';
import { prisma } from '../database/prismaClient';
import { billingChecker } from '../helpers/billing/billingChecker.helper';
import { enqueueNotificationsOnClientCall } from '../helpers/onClientCall/enqueueNotificationsOnClientCall.helper';
import { eventThrottlingChecker } from '../helpers/onClientCall/eventThrottlingChecker.helper';
import { generateHashKey } from '../helpers/onClientCall/generateHashKey.helper';
import { returnCallOnClientCall } from '../helpers/onClientCall/returnCallOnClientCall.helper';
import { getProjectByProjectName } from '../helpers/project/getProjectByProjectName.helper.';
import { notificationChannelChatIdsCheckerAndGetter } from '../helpers/project/notificationChannelChatIdsCheckerAndGetter.helper';
import { errorReturnCall } from '../helpers/returnCall/error.returnCall';
import { eventCountChecker } from '../helpers/user/eventCountChecker.helper';
import { getSelectedNotificationChannelsOfUser } from '../helpers/user/getSelectedNotificationChannelsOfUser.helper';
import { EventIdAndType } from '../types/applicationTypes';
import { ClientCallType } from '../types/dataTypes';
import { ErrorCode, HttpStatus } from '../types/errorCodes';
import { Event } from '../types/prismaTypes';

export const onClientIncidentWebhook = async (req: Request, res: Response) => {
  try {
    const validateData = ClientCallType.safeParse(req.body);

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
      include: { billing: true, project: { include: { contactDetails: true } }, configuration: true },
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

    // Event throttling
    const throttlingResult = await eventThrottlingChecker(user, validateData.data);
    let event!: Event;

    // If event exists and we dont have to send the notification, udpate the event
    if (throttlingResult.hasActiveEvent && !throttlingResult.sendNotification) {
      await prisma.event.update({
        where: { id: throttlingResult.event.id },
        data: {
          occurrences: { increment: 1 },
          occurrencesFromLastNotificationSent: { increment: 1 },
          ...(throttlingResult.event.occurrencesFromLastNotificationSent === 0 && {
            firstOccurenceAfterLastNotificationSent: new Date(),
          }),
        },
      });
      event = throttlingResult.event;

      res.status(HttpStatus.OK).json({ message: 'Notification throttled' });
      return;
    } else if (throttlingResult.hasActiveEvent && throttlingResult.sendNotification) {
      await prisma.event.update({
        where: { id: throttlingResult.event.id },
        data: {
          occurrences: { increment: 1 },
          occurrencesFromLastNotificationSent: 0,
          lastNotificationSent: new Date(),
          firstOccurenceAfterLastNotificationSent: null,
        },
      });
      event = throttlingResult.event;
    } else if (!throttlingResult.hasActiveEvent && throttlingResult.sendNotification) {
      // Gemerate hash key for the event
      const eventHashKey = generateHashKey(validateData.data);
      // Create an incident in the db
      event = await prisma.event.create({
        data: {
          ...validateData.data,
          lastNotificationSent: new Date(),
          userId,
          eventHashKey,
          throttlingWindow: user.configuration?.globalThrottleWindow!,
          occurrencesFromLastNotificationSent: 0,
          firstOccurenceAfterLastNotificationSent: new Date(),
        },
      });
    }

    // Check and get the notification channel's chat ids
    const allChatIdsInfo = notificationChannelChatIdsCheckerAndGetter(validateData.data.projectName, user, event.type);

    // Get selected notification channels of user
    const channels = getSelectedNotificationChannelsOfUser(user);

    // Extract event id and type
    const eventIdAndType: EventIdAndType = { id: event.id, type: event.type };

    // Enqueue notifications
    await enqueueNotificationsOnClientCall(user, eventIdAndType, channels, allChatIdsInfo);

    // Increase events used of user by 1
    await prisma.configuration.update({ where: { id: userId }, data: { eventsUsed: { increment: 1 } } });

    // Return to user
    returnCallOnClientCall(res, allChatIdsInfo);
    return;
  } catch (error) {
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};

// event comes -> event throttling -> if event exists -> increase the occurrences if its not resolved previously -> if resolved, continue ->
