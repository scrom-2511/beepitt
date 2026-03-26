import api from '@/requestHandler/api';
import axios from 'axios';

export interface Project {
  id: number;
  projectName: string;
  projectDesc: string;
}

export interface ProjectsResponse {
  allUserProjects: Project[];
}

export const getAllProjects = async (): Promise<ProjectsResponse> => {
  try {
    const res = await api.get('/user/getAllProjects');

    console.log(res);

    if (res.data.success) {
      return res.data.data as ProjectsResponse;
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
