import api from '@/requestHandler/api';
import axios from 'axios';

export interface RazorPayVerifyPaymentData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const razorPayVerifyPaymentHandler = async (data: RazorPayVerifyPaymentData) => {
  try {
    const res = await api.post('/user/razorPayVerifyPayment', data);

    if (res.data.success) {
      return res.data;
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
