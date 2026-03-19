import { BACKEND_URL } from '@/config/app.config';
import { UpdateRetryConfigType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';

export const updateRetryConfigHandler = async (
  data: z.infer<typeof UpdateRetryConfigType>,
): Promise<void> => {
  try {
    const res = await axios.post(
      BACKEND_URL + '/user/updateRetryConfig',
      data,
      { withCredentials: true },
    );

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message || 'Failed to update retry configuration');
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }

    throw new Error('There was an unknown error, please try again.');
  }
};