import type { UpdateIssuePriorityType } from "@/types/dataTypes";
import axios from "axios";
import type z from "zod";

export type UpdateIssuePriorityEnum = "Low" | "Critical" | "High" | "Closed";

export interface UpdateIssuePriorityBody {
  issueId: number;
  newPriority: UpdateIssuePriorityEnum;
}

export const updateIssuePriorityHandler = async (
  data: z.infer<typeof UpdateIssuePriorityType>,
): Promise<void> => {
  try {
    const res = await axios.post(
      "https://francisco-unscholarlike-punctually.ngrok-free.dev/user/updateIssuePriority",
      data,
      { withCredentials: true },
    );

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message || "Failed to fetch issues");
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error("There was an unknown error, please try again.");
  }
};
