import { Request, Response } from 'express';
import { prisma } from '../database/prismaClient';
import { onCallFromClientType } from '../types/dataTypes';
import { handleMessageSendingToClient } from '../utils/handleMessageSendingToClient.util';

export const onClientCallWebhook = async (req: Request, res: Response) => {
  console.log(req.body);
  const validateData = onCallFromClientType.safeParse(req.body);

  if (!validateData.success) {
    console.log('failedddddddd');
    return;
  }

  const userId = req.userId!;

  const data = { ...validateData.data, userId };

  await handleMessageSendingToClient(data);

  if (data.type === 'incident') {
    await prisma.incident.create({
      data: {
        incidentName: validateData.data.name,
        incidentDesc: validateData.data.desc,
        userId: userId!,
      },
    });
  } else {
    await prisma.issue.create({
      data: {
        issueName: validateData.data.name,
        issueDesc: validateData.data.desc,
        userId: userId!,
      },
    });
  }
};
