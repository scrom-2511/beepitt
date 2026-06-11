import { Request, Response } from 'express';
import { streamModel } from '../../utils/ai/streamModel.utils';

export const aiChatController = async (req: Request, res: Response) => {
  const { prompt, chatID, conversationID } = req.body;
  const userId = (req as any).userId;

  if (!prompt || !chatID || !conversationID) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Set headers for streaming
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const apikey = process.env.OPEN_ROUTER_API_KEY;
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
