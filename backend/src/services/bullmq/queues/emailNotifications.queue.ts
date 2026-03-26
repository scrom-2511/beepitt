import { Queue } from 'bullmq';
import { redis } from '../../redis/redisClient';

export const emailNotificationsQueue = new Queue('email-notifications', {
  connection: redis,
});
