import { Worker } from 'bullmq';
import { NotificationJob } from '../../../types/applicationTypes';
import { discordBeep } from '../../../utils/discordBeep.util';
import { redis } from '../../redis/redisClient';

export const discordNotificationsWorker = new Worker<NotificationJob>(
  'discord-notifications',
  async (job) => {
    const { userId, data, type } = job.data;

    await discordBeep(data, type);
  },
  {
    connection: redis,
    concurrency: 5,
    limiter: {
      max: 40,
      duration: 1000,
    },
  },
);

discordNotificationsWorker.on('failed', (job, err) => {
  //send it to retry queue
});
