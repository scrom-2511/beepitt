import { NotificationJob } from '../../../types/applicationTypes';
import { emailNotificationsQueue } from '../queues/emailNotifications.queue';

export const enqueueEmailNotifications = async (data: NotificationJob) => {
  try {
    await emailNotificationsQueue.add('enqueue-email-notifications', data, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 10000 }, // Slower backoff for email
    });
  } catch (error) {
    console.error(`Error enqueuing email notification: ${error}`);
  }
};
