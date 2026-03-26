import { NotificationChannels } from '../../../generated/prisma/enums';
import { enqueueDiscordNotifications } from '../../services/bullmq/producers/discordNotifications.producer';
import { enqueueEmailNotifications } from '../../services/bullmq/producers/emailNotifications.producer';
import { enqueueTelegramNotifications } from '../../services/bullmq/producers/telegramNotifications.producer';
import { ChatIdsInfo, EventIdAndType, NotificationJob } from '../../types/applicationTypes';
import { UserWithBillingConfigurationProjectContactDetails } from '../../types/prismaTypes';

const enqueuerMap: Record<NotificationChannels, (args: NotificationJob) => Promise<void>> = {
  [NotificationChannels.discord]: enqueueDiscordNotifications,
  [NotificationChannels.telegram]: enqueueTelegramNotifications,
  [NotificationChannels.email]: enqueueEmailNotifications,
  [NotificationChannels.slack]: async (args) => {},
};

export const enqueueNotificationsOnClientCall = async (
  user: UserWithBillingConfigurationProjectContactDetails,
  event: EventIdAndType,
  notificationChannels: NotificationChannels[],
  allChatIdsInfo: ChatIdsInfo[],
) => {
  // Set of notification channel
  const enabledChannels = new Set(notificationChannels);
  const jobs: Promise<void>[] = [];

  for (const channelInfo of allChatIdsInfo) {
    const channelName = channelInfo.channel;

    // If chat ids are not present, continue
    if (!channelInfo.present) continue;

    // If notification(enabled) channels doesnot include this.channel, continue (it scans in O(1)
    if (!enabledChannels.has(channelName)) continue;

    // Get the enqueuer
    const enqueuer = enqueuerMap[channelName];
    if (!enqueuer) continue;

    // If enqueuer exists, enqueue notification
    jobs.push(
      enqueuer({
        userId: user.id,
        data: channelInfo.chatIds,
        type: event.type,
        jobId: `${event.id}`,
        delay: 0,
      }),
    );

    const projectSettings = user.configuration;
    let maxRetries = projectSettings?.maxRetries!;
    const retryOffset = projectSettings?.retryOffset!;

    if (user.billing?.subscription_tier === 'pro') {
      for (let retry = 1; retry <= maxRetries; retry++) {
        jobs.push(
          enqueuer({
            userId: user.id,
            data: channelInfo.chatIds,
            type: event.type,
            jobId: `${event.id}-retry-${retry}`,
            delay: retryOffset * retry,
          }),
        );
      }
    }
  }
  await Promise.all(jobs);
};
