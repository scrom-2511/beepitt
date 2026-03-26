import { SignupType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';
import api from '../api';

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  timezone: string;
}
export const signupHandler = async (payload: z.infer<typeof SignupType>): Promise<void> => {
  try {
    const res = await api.post('/user/signup', data);

    if (res.data.success) {
      return;
    }
    throw new Error(res.data.error?.message);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
