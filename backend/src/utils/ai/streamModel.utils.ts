import { z } from 'zod';
import { Response } from 'express';
import { contextProvider, contextSetter } from './contextHandler';
import { prisma } from '../../database/prismaClient';
import { Message } from '../../types/ai.types';

const StreamModelSchema = z.object({
  prompt: z.string().min(1, "Valid prompt is required"),
  userID: z.number().positive("Valid userID is required"),
  apikey: z.string().min(1, "Valid apikey is required"),
  chatID: z.string().min(1, "Valid chatID is required"),
  conversationID: z.string().min(1, "Valid conversationID is required"),
});

export const streamModel = async (
  res: Response,
  prompt: string,
  userID: number,
  apikey: string,
  chatID: string,
  conversationID: string
): Promise<string> => {
  const model = "nvidia/nemotron-3-ultra-550b-a55b:free";

  StreamModelSchema.parse({ prompt, userID, apikey, chatID, conversationID });

  console.log(prompt, userID, apikey, chatID, conversationID);

  const context = await contextProvider(userID, chatID);

  console.log(context);

  const systemContent = context
    ? `You are an AI assistant. Use the following context to maintain a natural, continuous flow: ${context}. Do not greet me in every response. Avoid phrases like "from the context you provided"—your responses should feel seamless and conversational.`
    : "You are an AI assistant helping a developer fix issues in their application. Be concise and practical.";

  console.log(systemContent);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apikey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: prompt },
      ],
      stream: true,
      max_tokens: 1000,
    }),
  });

  console.log(response);
  console.log(response.body);

  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let finalResponse = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content || "";
            if (content) {
              finalResponse += content;
              console.log(content);
              res.write(content);
            }
          } catch (e) {
            // Ignore parse errors for partial chunks
          }
        }
      }
    }

    if (!finalResponse) {
      console.warn("No response received from AI, skipping persistence.");
      res.end();
      return "";
    }

    try {
      await prisma.chat.upsert({
        where: { chatUUID: chatID },
        update: { updatedAt: new Date() },
        create: { chatUUID: chatID, chatName: prompt.slice(0, 50), userID },
      });

      await prisma.conversation.upsert({
        where: { conversationID },
        update: { response: finalResponse },
        create: {
          conversationID,
          chatID,
          userID,
          prompt,
          response: finalResponse,
        },
      });

      const conversation: Message = { prompt, response: finalResponse };
      await contextSetter(userID, context, conversation, chatID);
    } catch (error) {
      console.error("Failed to save conversation:", error);
    }

    res.end();
    return finalResponse;
  } catch (error) {
    console.error("Error while streaming model response:", error);
    res.write("\n[ERROR]: Failed to stream response from AI.");
    res.end();
    throw error;
  }
};
