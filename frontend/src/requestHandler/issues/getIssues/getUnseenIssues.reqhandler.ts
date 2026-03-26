import api from '@/requestHandler/api';
import axios from 'axios';

export type IssuePriority = 'Undefined';

export interface Issue {
  id: number;
  issueName: string;
  issueDesc: string;
  issuePriority?: IssuePriority | null;
  issueDateAndTime: Date;
}

export interface IssuesResponse {
  issues: Issue[];
  nextCursor: number | null;
}

export const getUnseenIssuesHandler = async (lastId: number): Promise<IssuesResponse> => {
  try {
    const res = await api.get('/user/getUnseenIssues', {
      params: { lastId },
    });

    if (res.data.success) {
      return res.data.data as IssuesResponse;
    }

    throw new Error(res.data.error?.message || 'Failed to fetch issues');
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
