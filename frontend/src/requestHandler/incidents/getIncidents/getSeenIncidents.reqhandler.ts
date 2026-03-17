import { BACKEND_URL } from '@/config/app.config';
import axios from 'axios';
import type { IncidentsResponse } from './getUnseenIncidents.reqhandler';
export const getSeenIncidentsHandler = async (lastId: number): Promise<IncidentsResponse> => {
  try {
    const res = await axios.get(BACKEND_URL + '/user/getSeenIncidents', {
      withCredentials: true,
      params: { lastId },
    });

    if (res.data.success) {
      return res.data.data as IncidentsResponse;
    }

    throw new Error(res.data.error?.message || 'Failed to fetch incidents');
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
