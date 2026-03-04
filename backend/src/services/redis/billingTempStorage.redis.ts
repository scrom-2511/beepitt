import { redis } from './redisClient';

export const setUserBillingInfo = async (userId: number, info: string) => {
  const key = `billingInfo:${userId}`;
  await redis.set(key, info, 'EX', 86400 / 2);
};

export const getUserBillingInfo = async (userId: number) => {
  const key = `billingInfo:${userId}`;
  const info = await redis.get(key);
  if (!info) return null;
  return info;
};
