import { Request, Response } from 'express';
import { prisma } from '../database/prismaClient';
import { onErrorFromClientType } from '../types/dataTypes';
import { handleMessageSendingToClient } from '../utils/handleMessageSendingToClient.util';

export const onClientErrorWebhook = async (req: Request, res: Response) => {
  console.log(req.body);
  const validateData = onErrorFromClientType.safeParse(req.body);

  if (!validateData.success) {
    console.log('failedddddddd');
    return;
  }

  const jwtSecretForClient = process.env.JWT_SECRET!;

  const userId = req.userId!;

  const errorData = { ...validateData.data, userId };

  await handleMessageSendingToClient(errorData);

  const newError = await prisma.issue.create({
    data: {
      issueName: validateData.data.errorName,
      issueDesc: validateData.data.errorDesc,
      userId: userId!,
    },
  });
};
