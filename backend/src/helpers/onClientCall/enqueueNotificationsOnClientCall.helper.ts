import { NotificationChannels } from '../../../generated/prisma/enums';
import { enqueueDiscordNotifications } from '../../services/bullmq/producers/discordNotifications.producer';
import { enqueueTelegramNotifications } from '../../services/bullmq/producers/telegramNotifications.producer';
import { ChatIdsInfo, NotificationJob } from '../../types/applicationTypes';
import { NotificationType } from '../../types/dataTypes';

const enqueuerMap: Record<NotificationChannels, (args: NotificationJob) => Promise<void>> = {
  [NotificationChannels.discord]: enqueueDiscordNotifications,
  [NotificationChannels.telegram]: enqueueTelegramNotifications,
  [NotificationChannels.email]: async (args) => {},
  [NotificationChannels.slack]: async (args) => {},
};

export const enqueueNotificationsOnClientCall = async (
  userId: number,
  notificationChannels: NotificationChannels[],
  allChatIdsInfo: ChatIdsInfo[],
) => {
  // Set of notification channel
  const enabledChannels = new Set(notificationChannels);

  for (const channelInfo of allChatIdsInfo) {
    const channelName = channelInfo.channel;

    // If chat ids are not present, continue
    if (!channelInfo.present) continue;

    // If notification(enabled) channels doesnot include this.channel, continue (it scans in O(1)
    if (!enabledChannels.has(channelName)) continue;

    // Get the enqueuer
    const enqueuer = enqueuerMap[channelName];

    // If enqueuer exists, enqueue notification
    if (enqueuer) {
      await enqueuer({
        userId,
        data: channelInfo.chatIds,
        type: NotificationType.incident,
      });
    }
  }
};
