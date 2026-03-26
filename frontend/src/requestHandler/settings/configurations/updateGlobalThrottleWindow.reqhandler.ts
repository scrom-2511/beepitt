import api from '@/requestHandler/api';
import type { UpdateGlobalThrottleWindowType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';

export const updateGlobalThrottleWindowHandler = async (
  data: z.infer<typeof UpdateGlobalThrottleWindowType>,
): Promise<void> => {
  try {
    const res = await api.post('/user/updateGlobalThrottleWindow', data);

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message || 'Failed to update throttle window');
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
