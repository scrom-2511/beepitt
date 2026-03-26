import api from '@/requestHandler/api';
import axios from 'axios';

export interface Incident {
  id: number;
  incidentName: string;
  incidentDesc: string;
  incidentSeen: boolean;
  incidentDateAndTime: string;
}

export interface IncidentsResponse {
  incidents: Incident[];
  nextCursor: number | null;
}

export const getUnseenIncidentsHandler = async (lastId: number): Promise<IncidentsResponse> => {
  try {
    const res = await api.get('/user/getUnseenIncidents', {
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
