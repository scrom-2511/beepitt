import { ProfileUpdateType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';
import api from '../api';

export const profileDetailsUpdateHandler = async (payload: z.infer<typeof ProfileUpdateType>): Promise<void> => {
  try {
    const res = await api.post('/user/updateProfileDetails', payload);
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
