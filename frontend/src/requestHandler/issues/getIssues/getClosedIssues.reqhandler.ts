import { BACKEND_URL } from '@/config/app.config';
import axios from 'axios';

export type IssuePriority = 'Fixed';
export interface Issue {
  id: number;
  issueName: string;
  issueDesc: string;
  issuePriority?: IssuePriority;
  issueDateAndTime: Date;
  issueResolveDateAndTime: Date;
}

interface IssuesResponse {
  issues: Issue[];
  nextCursor: number | null;
}

export const getClosedIssuesHandler = async (lastId: number): Promise<IssuesResponse> => {
  try {
    const res = await axios.get(BACKEND_URL + '/user/getClosedIssues', {
      withCredentials: true,
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
