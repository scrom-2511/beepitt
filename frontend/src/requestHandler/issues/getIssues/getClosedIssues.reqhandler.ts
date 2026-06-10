import api from '@/requestHandler/api';
import axios from 'axios';

import { IssuePriority } from '@/types/enums';

export interface Issue {
  id: number;
  name: string;
  description: string;
  priority: IssuePriority | null;
  createdAt: string;
  resolvedAt: string | null;
}

interface IssuesResponse {
  issues: Issue[];
  nextCursor: number | null;
}

export const getClosedIssuesHandler = async (lastId: number): Promise<IssuesResponse> => {
  try {
    const res = await api.get('/user/getClosedIssues', {
      params: { lastId },
    });

    if (res.data.success) {
      return res.data.data as IssuesResponse;
    }

    throw new Error(res.data.error?.message || 'Failed to fetch issues');
  } catch (err: any) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
