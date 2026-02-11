import { NotificationJob } from '../../../types/dataTypes';
import { discordNotificationsQueue } from '../queues/discordNotifications.queue';

export const enqueueDiscordNotifications = async (data: NotificationJob) => {
  try {
    await discordNotificationsQueue.add('enqueue-discord-notifications', data, {
      attempts: 7,
      backoff: { type: 'exponential', delay: 5000 },
    });
  } catch (error) {
    console.error(error);
  }
};
