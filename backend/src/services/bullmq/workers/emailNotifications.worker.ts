import { Worker } from 'bullmq';
import { NotificationJob } from '../../../types/applicationTypes';
import { emailBeep } from '../../../utils/emailBeep.util';
import { redis } from '../../redis/redisClient';

export const emailNotificationsWorker = new Worker<NotificationJob>(
  'email-notifications',
  async (job) => {
    const { userId, data, type } = job.data;

    await emailBeep(data, type);
  },
  {
    connection: redis,
    concurrency: 5,
    limiter: {
      max: 20, // Lower limit for email to avoid being flagged
      duration: 1000,
    },
  },
);

emailNotificationsWorker.on('failed', (job, err) => {
  console.error(`Email Job Failed for id ${job?.id}: ${err.message}`);
});
