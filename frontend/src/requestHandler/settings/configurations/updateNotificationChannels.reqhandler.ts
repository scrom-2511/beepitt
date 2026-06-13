import api from '@/requestHandler/api';
import type { NotificationChannels } from '@/types/applicationTypes';
import axios from 'axios';

type UpdateNotificationChannelsPayload = {
  channels: NotificationChannels[];
};

export const updateNotificationChannelsHandler = async (payload: UpdateNotificationChannelsPayload): Promise<void> => {
  try {
    const res = await api.post('/user/updateNotificationChannels', payload);

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message || 'Failed to update notification channels');
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }

    throw new Error('There was an unknown error, please try again.');
  }
};
