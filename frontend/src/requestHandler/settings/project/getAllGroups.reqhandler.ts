import api from '@/requestHandler/api';
import axios from 'axios';

export interface GroupsResponse {
  groups: string[];
}

export const getAllGroupsHandler = async (): Promise<GroupsResponse> => {
  try {
    const res = await api.get('/user/getAllGroups');

    if (res.data.success) {
      return res.data.data as GroupsResponse;
    }

    throw new Error(res.data.error?.message || 'Failed to fetch groups');
  } catch (err: any) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
