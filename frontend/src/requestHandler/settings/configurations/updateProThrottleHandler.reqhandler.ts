import api from '@/requestHandler/api';
import type { UpdateProThrottleType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';

export const updateProThrottleHandler = async (
  data: z.infer<typeof UpdateProThrottleType>,
): Promise<void> => {
  try {
    const res = await api.post('/user/updateProThrottle', data);

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message || 'Failed to update pro throttle settings');
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }

    throw new Error('There was an unknown error, please try again.');
  }
};