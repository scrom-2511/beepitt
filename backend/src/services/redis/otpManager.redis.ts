import { redis } from './redisClient';

export const setOtp = async (otp: string, userId: number) => {
  const key = `otp:${userId}`;
  await redis.set(key, otp, 'EX', 300);
};

export const verifyOtp = async (userId: number, otp: string) => {
  const key = `otp:${userId}`;
  const storedOtp = await redis.get(key);

  if (!storedOtp || storedOtp !== otp) return false;

  await redis.del(key);
  return true;
};
