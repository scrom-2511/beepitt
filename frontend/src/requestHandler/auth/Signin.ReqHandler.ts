import type { SubscriptionTier } from '@/types/applicationTypes';
import { LoginType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';
import api from '../api';

export interface SigninRequest {
  email: string;
  password: string;
}

interface SigninResponse {
  timeZone: string;
  userSubscriptionTier: SubscriptionTier;
}

export const signinHandler = async (payload: z.infer<typeof LoginType>): Promise<SigninResponse> => {
  try {
    const res = await api.post('/user/signin', payload);

    if (res.data.success) {
      return res.data.data as SigninResponse;
    }

    throw new Error(res.data.error?.message);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
