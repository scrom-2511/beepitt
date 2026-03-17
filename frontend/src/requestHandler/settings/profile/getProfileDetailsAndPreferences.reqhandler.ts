import { BACKEND_URL } from '@/config/app.config';
import axios from 'axios';

export interface ProfileDetailsAndPrefernces {
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  timezone: string;
  dateFormat: string;
}

export const getProfileDetailsAndPreferences = async (): Promise<ProfileDetailsAndPrefernces> => {
  try {
    const res = await axios.get(
      BACKEND_URL + '/user/getProfileDetailsAndPreferences',
      { withCredentials: true },
    );

    if (res.data.success) {
      return res.data.data as ProfileDetailsAndPrefernces;
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
