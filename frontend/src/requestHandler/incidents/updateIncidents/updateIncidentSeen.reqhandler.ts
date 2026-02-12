import type { UpdateIncidentSeenType } from "@/types/dataTypes";
import axios from "axios";
import type z from "zod";

export const updateIncidentSeenHandler = async (
  data: z.infer<typeof UpdateIncidentSeenType>,
): Promise<void> => {
  try {
    const res = await axios.post(
      "https://francisco-unscholarlike-punctually.ngrok-free.dev/user/updateIncidentSeen",
      data,
      { withCredentials: true },
    );

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message || "Failed to fetch incidents");
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error("There was an unknown error, please try again.");
  }
};
