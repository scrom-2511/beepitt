import axios from "axios";

export type IssuePriority = "Undefined";
export interface Issue {
  id: number;
  issueName: string;
  issueDesc: string;
  issuePriority?: IssuePriority | null;
  issueDateAndTime: Date;
}

export const getUnseenIssuesHandler = async (): Promise<Issue[]> => {
  try {
    const res = await axios.get(
      "https://francisco-unscholarlike-punctually.ngrok-free.dev/user/getUnseenIssues",
      { withCredentials: true },
    );

    if (res.data.success) {
      return res.data.data as Issue[];
    }

    throw new Error(res.data.error?.message || "Failed to fetch issues");
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error("There was an unknown error, please try again.");
  }
};
