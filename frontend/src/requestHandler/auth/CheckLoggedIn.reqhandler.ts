import { BACKEND_URL } from '@/config/app.config';
import axios from 'axios';

export const checkLoggedInHandler = async (): Promise<boolean> => {
  try {
    const res = await axios.get(BACKEND_URL + '/user/checkLoggedIn', {
      withCredentials: true,
    });

    if (res.data.success) {
      return true;
    }

    throw new Error(res.data.error?.message || 'Failed to fetch');
  } catch (err: any) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
