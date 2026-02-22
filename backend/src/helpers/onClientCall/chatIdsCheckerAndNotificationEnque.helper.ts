import { Request } from 'express';
import { Prisma } from '../../../generated/prisma/client';
import { enqueueDiscordNotifications } from '../../services/bullmq/producers/discordNotifications.producer';
import { enqueueTelegramNotifications } from '../../services/bullmq/producers/telegramNotifications.producer';
import { NotificationType } from '../../types/dataTypes';

type UserWithOtherDetails = Prisma.UserGetPayload<{
  include: { contactDetails: true; billing: true; projectDetails: true };
}>;

export const chatIdsCheckerAndNotificationEnque = async (
  req: Request,
  user: UserWithOtherDetails | null,
) => {
  const contactDetails = user?.contactDetails;
  let telegramChatIdsPresent = false;
  let discordChatIdsPresent = false;

  if (
    contactDetails?.discordChatIds.length &&
    contactDetails.discordChatIds.length > 0
  ) {
    discordChatIdsPresent = true;
    await enqueueDiscordNotifications({
      userId: req.userId!,
      data: contactDetails.discordChatIds,
      type: NotificationType.Incident,
    });
  }

  if (
    contactDetails?.telegramChatIds.length &&
    contactDetails.telegramChatIds.length > 0
  ) {
    telegramChatIdsPresent = true;
    await enqueueTelegramNotifications({
      userId: req.userId!,
      data: contactDetails.telegramChatIds,
      type: NotificationType.Incident,
    });
  }

  return { telegramChatIdsPresent, discordChatIdsPresent };
};
