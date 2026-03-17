import { BACKEND_URL } from '@/config/app.config';
import type { ProjectNameType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';

export const createProjectHandler = async (data: z.infer<typeof ProjectNameType>): Promise<void> => {
  try {
    const res = await axios.post(BACKEND_URL + '/user/createProject', data, { withCredentials: true });

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message || 'Failed to fetch incidents');
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
