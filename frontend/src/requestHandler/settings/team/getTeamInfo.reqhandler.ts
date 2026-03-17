import { BACKEND_URL } from '@/config/app.config';
import axios from 'axios';

export interface TeamInfoResponse {
  identifierKey: string;
  telegramChatIds: string[];
  discordChatIds: string[];
}

export const getTeamInfoHandler = async (): Promise<TeamInfoResponse> => {
  try {
    console.log('bro i reached this part');
    const res = await axios.get(BACKEND_URL + '/user/getTeamInfo', {
      withCredentials: true,
    });

    if (res.data.success) {
      return res.data.data as TeamInfoResponse;
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
