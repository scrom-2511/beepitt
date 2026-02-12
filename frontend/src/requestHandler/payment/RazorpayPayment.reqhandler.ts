import type { RazorPayCreateOrderType } from "@/types/dataTypes";
import axios from "axios";
import type z from "zod";

export interface RazorPayCreateOrderResponse {
  orderId: string;
  currency: string;
  amount: string;
  dbOrderId: string;
}

export const razorPayCreateOrderHandler = async (
  data: z.infer<typeof RazorPayCreateOrderType>,
): Promise<RazorPayCreateOrderResponse> => {
  try {
    const res = await axios.post(
      "https://francisco-unscholarlike-punctually.ngrok-free.dev/user/razorPayCreateOrder",
      data,
      {
        withCredentials: true,
      },
    );

    if (res.data.success) {
      return res.data.data as RazorPayCreateOrderResponse;
    }

    throw new Error(res.data.error?.message);
  } catch (err) {
    console.error(err);

    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }

    throw new Error("There was an unknown error, please try again.");
  }
};
