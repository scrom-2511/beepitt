import api from '../api';

export const otpSenderHandler = async (): Promise<void> => {
  try {
    const res = await api.get('/user/otpSender');

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message || 'Failed to send OTP');
  } catch (err: any) {
    throw new Error(err.response?.data?.error?.message || err.message || 'There was an unknown error, please try again.');
  }
};
