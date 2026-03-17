import { BACKEND_URL } from '@/config/app.config';
import { ProfileUpdateType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';

export const profileDetailsUpdateHandler = async (data: z.infer<typeof ProfileUpdateType>): Promise<void> => {
  try {
    const res = await axios.post(
      BACKEND_URL + '/user/updateProfileDetails',
      data,
      {
        withCredentials: true,
      },
    );
    if (res.data.success) return;

    throw new Error(res.data.error?.message);
  } catch (err) {
    console.error(err);
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
