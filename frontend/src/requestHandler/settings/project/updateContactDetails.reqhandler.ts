import api from '@/requestHandler/api';
import axios from 'axios';

export interface UpdateContactDetailsPayload {
  projectId: number;
  emailIds?: string[];
  telegramChatIds?: string[];
  discordChatIds?: string[];
}

export const updateContactDetailsHandler = async (payload: UpdateContactDetailsPayload): Promise<void> => {
  try {
    const res = await api.post('/user/updateContactDetails', payload);

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message || 'Failed to update contact details');
  } catch (err: any) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
