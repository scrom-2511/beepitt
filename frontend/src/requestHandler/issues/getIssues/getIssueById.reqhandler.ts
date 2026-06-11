import api from '@/requestHandler/api';
import type { Issue } from './getOpenIssues.reqhandler';

export const getIssueByIdHandler = async (issueId: string): Promise<Issue> => {
  const response = await api.get(`/user/getIssueById/${issueId}`);
  return response.data.issue;
};
