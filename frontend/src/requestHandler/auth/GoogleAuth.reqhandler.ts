import axios from 'axios';
import api from '../api';

interface GoogleAuthBody {
  token: string;
}

export const googleAuthHandler = async (payload: GoogleAuthBody): Promise<void> => {
  try {
    const res = await api.post('/user/googleAuth', data);

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message || 'Failed to authenticate using google');
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
