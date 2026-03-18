import { NotificationJob } from '../../../types/applicationTypes';
import { telegramNotificationsQueue } from '../queues/telegramNotifications.queue';

export const enqueueTelegramNotifications = async (data: NotificationJob) => {
  try {
    await telegramNotificationsQueue.add('enqueue-telegram-notifications', data, {
      attempts: 7,
      backoff: { type: 'exponential', delay: 5000 },
    });
  } catch (error) {
    console.error(error);
  }
};
