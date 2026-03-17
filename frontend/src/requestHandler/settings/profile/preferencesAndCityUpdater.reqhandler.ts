import { BACKEND_URL } from '@/config/app.config';
import type { TimeZoneAndPreferencesUpdateType } from '@/types/dataTypes';
import axios from 'axios';
import type z from 'zod';

export interface UpdatePreferencesAndCityBody {
  city: string;
  timezone: string;
}

export const updateTimeZoneAndPreferencesHandler = async (
  data: z.infer<typeof TimeZoneAndPreferencesUpdateType>,
): Promise<void> => {
  try {
    const res = await axios.post(
      BACKEND_URL + '/user/updateTimeZoneAndPreferences',
      data,
      { withCredentials: true },
    );

    if (res.data.success) return;

    throw new Error(res.data?.error?.message || 'Failed to update preferences');
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }

    throw new Error('There was an unknown error, please try again.');
  }
};
