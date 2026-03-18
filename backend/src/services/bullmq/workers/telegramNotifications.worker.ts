import { Worker } from 'bullmq';
import { NotificationJob } from '../../../types/applicationTypes';
import { telegramBeep } from '../../../utils/telegramBeep.utils';
import { redis } from '../../redis/redisClient';

export const telegramNotificationsWorker = new Worker<NotificationJob>(
  'telegram-notifications',
  async (job) => {
    const { userId, data, type } = job.data;

    await telegramBeep(data, type);
  },
  {
    connection: redis,
    concurrency: 5,
    limiter: {
      max: 25,
      duration: 1000,
    },
  },
);

telegramNotificationsWorker.on('failed', (job, err) => {
  //send it to retry queue
});
