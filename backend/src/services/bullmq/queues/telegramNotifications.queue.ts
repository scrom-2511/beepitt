import { Queue } from 'bullmq';
import { redis } from '../../redis/redisClient';

export const telegramNotificationsQueue = new Queue('telegram-notifications', {
  connection: redis,
});