import { BACKEND_URL } from '@/config/app.config';
import axios from 'axios';

type UpdateNotificationChannelsPayload = {
  channels: ('slack' | 'email' | 'telegram' | 'discord')[];
};

export const updateNotificationChannelsHandler = async (data: UpdateNotificationChannelsPayload): Promise<void> => {
  try {
    const res = await axios.patch(BACKEND_URL + '/user/updateNotificationChannels', data, { withCredentials: true });

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
