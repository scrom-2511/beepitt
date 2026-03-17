import { BACKEND_URL } from '@/config/app.config';
import axios from 'axios';

export type NotificationChannels = 'telegram' | 'discord' | 'slack' | 'email';

export interface ConfigurationsResponse {
  globalThrottleWindow: number;
  eventTriggerCount: number;
  eventTriggerWindow: number;
  maxRetries: number;
  retryOffset: number;
  notificationChannels: NotificationChannels[];
}

export const getConfigurationsHandler = async (): Promise<ConfigurationsResponse> => {
  try {
    const res = await axios.get(BACKEND_URL + '/user/getConfigurations', {
      withCredentials: true,
    });

    if (res.data.success) {
      return res.data.data as ConfigurationsResponse;
    }

    throw new Error(res.data.error?.message || 'Failed to fetch configurations');
  } catch (err: any) {
    console.log(err);

    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }

    throw new Error('There was an unknown error, please try again.');
  }
};