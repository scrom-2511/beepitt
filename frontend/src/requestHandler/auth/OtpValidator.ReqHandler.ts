import { OtpValidateType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';
import api from '../api';

export interface OtpValidatorRequest {
  otp: string;
}

export const otpValidatorHandler = async (payload: z.infer<typeof OtpValidateType>): Promise<void> => {
  try {
    const res = await api.post('/user/otpValidator', payload);

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
