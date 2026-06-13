import api from '@/requestHandler/api';
import type { RazorPayCreateOrderType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';

export interface RazorPayCreateOrderResponse {
  orderId: string;
  currency: string;
  amount: string;
  dbOrderId: string;
  name: string;
  email: string;
}

export const razorPayCreateOrderHandler = async (
  data: z.infer<typeof RazorPayCreateOrderType>,
): Promise<RazorPayCreateOrderResponse> => {
  try {
    const res = await api.post('/user/razorPayCreateOrder', data);

    if (res.data.success) {
      return res.data.data as RazorPayCreateOrderResponse;
    }

    throw new Error(res.data.error?.message);
  } catch (err) {
    console.error(err);

    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }

    throw new Error('There was an unknown error, please try again.');
  }
};
