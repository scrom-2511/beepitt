import api from '@/requestHandler/api';
import type { NotificationChannels } from '@/types/applicationTypes';
import axios from 'axios';

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
    const res = await api.get('/user/getConfigurations');

    if (res.data.success) {
      console.log(res.data.data);
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
