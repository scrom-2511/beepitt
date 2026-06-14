import api from '@/requestHandler/api';
import type { UpdateIncidentSeenType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';

export const updateIncidentSeenHandler = async (payload: z.infer<typeof UpdateIncidentSeenType>): Promise<void> => {
  try {
    const res = await api.post('/user/updateIncidentSeen', payload);

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message || 'Failed to update incident');
  } catch (err: any) {

    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
