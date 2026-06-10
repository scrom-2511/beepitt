import api from '@/requestHandler/api';
import axios from 'axios';

import { Environment, IssuePriority } from '@/types/enums';

export interface Issue {
  id: number;
  name: string;
  description: string;
  priority: IssuePriority | null;
  createdAt: string;
  projectName: string;
  environment: Environment;
  occurrences: number;
  filePath: string | null;
  lineNumber: number | null;
  columnNumber: number | null;
  group: string | null;
}

export interface IssuesResponse {
  issues: Issue[];
  nextCursor: number | null;
}

export const getOpenIssuesHandler = async (
  lastId: number,
  priority: IssuePriority | null,
  environment: Environment | null,
  group: string | null
): Promise<IssuesResponse> => {
  try {
    const res = await api.get('/user/getOpenIssues', {
      params: { lastId, priority, environment, group },
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
