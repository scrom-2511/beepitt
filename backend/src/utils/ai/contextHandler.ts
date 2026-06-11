import { z } from 'zod';
import { prisma } from '../../database/prismaClient';
import { redis } from '../../services/redis/redisClient';
import { Message } from '../../types/ai.types';

const ContextProviderSchema = z.object({
  userID: z.number().positive(),
  chatID: z.string().min(1),
});

const ConversationSchema = z.object({
  prompt: z.string().min(1),
  response: z.string(),
});

const ContextSetterSchema = z.object({
  userID: z.number().positive(),
  chatID: z.string().min(1),
  conversation: ConversationSchema,
});

export const contextProvider = async (
  userID: number,
  chatID: string
): Promise<string | null> => {
  ContextProviderSchema.parse({ userID, chatID });

  console.log(userID, chatID);

  const cacheKey = `chat_context:${userID}:${chatID}`;

  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  const data = await prisma.conversation.findMany({
    where: {
      chatID,
      userID,
      response: { not: null },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  if (!data || data.length === 0) {
    console.log("No data found");
    return null;
  }

  const contextArr: Message[] = data.map((d: any) => ({
    prompt: d.prompt,
    response: d.response as string,
  }));

  contextArr.reverse();

  const serialized = JSON.stringify(contextArr);
  await redis.set(cacheKey, serialized, 'EX', 3600);

  console.log(serialized);

  return serialized;
};

export const contextSetter = async (
  userID: number,
  context: string | null,
  conversation: Message,
  chatID: string
): Promise<void> => {
  ContextSetterSchema.parse({ userID, chatID, conversation });

  const cacheKey = `chat_context:${userID}:${chatID}`;

  let existingData: Message[] = [];
  if (context) {
    existingData = JSON.parse(context);
    if (existingData.length >= 20) {
      existingData.shift();
    }
  }

  existingData.push(conversation);

  await redis.set(cacheKey, JSON.stringify(existingData), 'EX', 3600);
};
