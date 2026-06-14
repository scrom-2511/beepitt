import api from '@/requestHandler/api';
import axios from 'axios';

import { Environment } from '@/types/enums';

export interface Incident {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  projectName: string;
  environment: Environment;
  occurrences: number;
  filePath: string | null;
  lineNumber: number | null;
  columnNumber: number | null;
  group: string | null;
  seenAt: string | null;
}


export interface IncidentsResponse {
  incidents: Incident[];
  nextCursor: number | null;
}

export const getUnseenIncidentsHandler = async (
  lastId: number,
  environment: Environment | null,
  group: string | null
): Promise<IncidentsResponse> => {
  try {
    const res = await api.get('/user/getUnseenIncidents', {
      params: { lastId, environment, group },
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

