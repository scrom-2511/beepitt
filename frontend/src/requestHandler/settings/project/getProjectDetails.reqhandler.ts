import { BACKEND_URL } from '@/config/app.config';
import axios from 'axios';

export interface ContactDetails {
  telegramChatIds: string[];
  discordChatIds: string[];
  telegramChatIds2?: string[];
  discordChatIds2?: string[];
}

export interface ProjectDetails {
  projectName: string;
  projectDesc: string;
  identifierKey: string;
  contactDetails: ContactDetails;
}

export const getProjectDetailsHandler = async (projectId: number): Promise<ProjectDetails> => {
  try {
    const res = await axios.get(BACKEND_URL + `/user/getProjectDetails/${projectId}`, {
      withCredentials: true,
    });

    if (res.data.success) {
      return res.data.data as ProjectDetails;
    }

    throw new Error(res.data.error?.message || 'Failed to fetch project details');
  } catch (err: any) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};