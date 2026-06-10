import api from '@/requestHandler/api';
import type { UpdateIssuePriorityType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';

import { IssuePriority } from '@/types/enums';

export type UpdateIssuePriorityEnum = IssuePriority;

export const updateIssuePriorityHandler = async (payload: z.infer<typeof UpdateIssuePriorityType>): Promise<void> => {
  try {
    const res = await api.post('/user/updateIssuePriority', payload);

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message || 'Failed to fetch issues');
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
