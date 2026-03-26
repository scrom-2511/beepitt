import api from '@/requestHandler/api';
import axios from 'axios';

export interface AnalyticsData {
  tier: 'free' | 'starter' | 'pro';
  used: number;
  limit: number;
  incidents: number;
  issues: number;
  topProject: {
    topIncidentProject: string | null;
    topIncidentCount: number;
    topIssuesProject: string | null;
    topIssuesCount: number;
  };
  priorityDistribution?: Array<{
    priority: string;
    count: number;
  }>;
  environmentBreakdown?: Array<{
    environment: string;
    count: number;
  }>;
  filePathStats?: Array<{
    filePath: string;
    lineNumber: number | null;
    totalOccurrences: number;
    eventCount: number;
  }>;
  uniqueVsRecurring?: {
    totalEvents: number;
    uniqueEvents: number;
    repeatedEvents: number;
    recurrenceRate: number;
  };
  projects?: Array<{
    projectName: string;
    incidents: number;
    issues: number;
    totalEvents: number;
  }>;
  throttlingEfficiency?: {
    used: number;
    limit: number;
    utilizationPercentage: number;
  };
  trends?: {
    last30Days: Array<{
      date: string;
      count: number;
    }>;
  };
  mostFrequentEvent?: {
    name: string;
    type: string;
    occurrences: number;
    projectName: string;
  } | null;
  avgResolutionTimeMinutes?: number;
}

export interface AnalyticsResponse {
  data: AnalyticsData;
}

export const getAnalyticsDataHandler = async (): Promise<AnalyticsData> => {
  try {
    const res = await api.get('/user/getAnalyticsData');

    if (res.data.success) {
      return res.data.data as AnalyticsData;
    }

    throw new Error(res.data.error?.message || 'Failed to fetch analytics data');
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }
};
