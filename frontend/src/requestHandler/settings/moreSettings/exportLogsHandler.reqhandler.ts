import api from '@/requestHandler/api';
import type { ExportLogsType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';

export const exportLogsHandler = async (payload: z.infer<typeof ExportLogsType>): Promise<void> => {
  try {
    const res = await api.post('/logs/export', data);

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message || 'Failed to export logs');
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }

    throw new Error('There was an unknown error, please try again.');
  }
};
