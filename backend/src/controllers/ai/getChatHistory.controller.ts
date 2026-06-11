import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { z } from 'zod';

const GetChatHistorySchema = z.object({
  chatID: z.string().min(1),
});

export const getChatHistoryController = async (req: Request, res: Response) => {
  const { chatID } = req.params;
  const userId = (req as any).userId;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const result = GetChatHistorySchema.safeParse({ chatID });
  if (!result.success) {
    return res.status(400).json({ success: false, message: "Invalid chatID", errors: result.error.format() });
  }

  try {
    const data = await prisma.conversation.findMany({
      where: {
        chatID: chatID as string,
        userID: userId,
        response: { not: null },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const messages = data.reverse().flatMap((d) => [
      { role: 'user', content: d.prompt },
      { role: 'assistant', content: d.response },
    ]);

    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
