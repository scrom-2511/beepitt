import api from '@/requestHandler/api';
import axios from 'axios';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const getChatHistoryHandler = async (chatID: string): Promise<ChatMessage[]> => {
  try {
    const res = await api.get(`/user/getChatHistory/${chatID}`);

    if (res.data.success) {
      return res.data.data;
    }

    throw new Error(res.data.message || 'Failed to fetch chat history');
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || err.message);
    }
    throw new Error('An unknown error occurred while fetching chat history.');
  }
};
