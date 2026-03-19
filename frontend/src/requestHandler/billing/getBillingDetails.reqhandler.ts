import { BACKEND_URL } from '@/config/app.config';
import type { CurrentStatus, SubscriptionTier } from '@/types/applicationTypes';
import axios from 'axios';

export interface BillingDetailsResponse {
  id: number;
  subscription_tier: SubscriptionTier;
  currentStatus: CurrentStatus;
  validTill: string;
  userId: number;
}

export const getBillingDetailsHandler = async (): Promise<BillingDetailsResponse> => {
  try {
    const res = await axios.get(BACKEND_URL + '/user/getBillingDetails', {
      withCredentials: true,
    });

    if (res.data.success) {
      console.log(res.data);
      return res.data.data as BillingDetailsResponse;
    }

    throw new Error(res.data.error?.message || 'Failed to fetch billing details');
  } catch (err: any) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
