import { LoginType } from "@/types/dataTypes";
import axios from "axios";
import type z from "zod";

export interface SigninRequest {
  email: string;
  password: string;
}

interface SigninResponse {
  timeZone: string;
}

export const signinHandler = async (
  data: z.infer<typeof LoginType>,
): Promise<SigninResponse> => {
  try {
    const res = await axios.post(
      "https://francisco-unscholarlike-punctually.ngrok-free.dev/user/signin",
      data,
      { withCredentials: true },
    );

    if (res.data.success) {
      return res.data.data as SigninResponse;
    }

    throw new Error(res.data.error?.message);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error("There was an unknown error, please try again.");
  }
};
