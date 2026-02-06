import axios from "axios";

export interface Incident {
  id: number;
  incidentName: string;
  incidentDesc: string;
  incidentSeen: boolean;
  incidentDateAndTime: Date;
}

export const getUnseenIncidentsHandler = async (): Promise<Incident[]> => {
  try {
    const res = await axios.get(
      "https://francisco-unscholarlike-punctually.ngrok-free.dev/user/getUnseenIncidents",
      { withCredentials: true },
    );

    if (res.data.success) {
      return res.data.data as Incident[];
    }

    throw new Error(res.data.error?.message || "Failed to fetch incidents");
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error("There was an unknown error, please try again.");
  }
};
