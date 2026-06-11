import { z } from 'zod';
import { Request, Response } from 'express';
import { streamModel } from '../../utils/ai/streamModel.utils';

const ChatRequestSchema = z.object({
  prompt: z.string().min(1),
  chatID: z.string().min(1),
  conversationID: z.string().min(1),
});

export const aiChatController = async (req: Request, res: Response) => {
  const result = ChatRequestSchema.safeParse(req.body);
  const userId = (req as any).userId;

  if (!result.success) {
    return res.status(400).json({ message: "Missing or invalid required fields", errors: result.error.format() });
  }

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log(result.data);

  const { prompt, chatID, conversationID } = result.data;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const apikey = process.env.OPEN_ROUTER_API_KEY;
    console.log(apikey);

    if (!apikey) {
      res.write("Error: OPEN_ROUTER_API_KEY is not set in environment variables.");
      res.end();
      return;
    }

    await streamModel(res, prompt, userId, apikey, chatID, conversationID);
  } catch (error) {
    console.error("AI Chat Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.write("\n[SERVER ERROR]");
      res.end();
    }
  }
};
