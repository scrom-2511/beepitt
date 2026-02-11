import { Queue } from 'bullmq';
import { redis } from '../../redis/redisClient';

export const discordNotificationsQueue = new Queue('discord-notifications', {
  connection: redis,
});
