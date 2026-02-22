import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const getTeamInfoController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const chatIds = await prisma.contactDetails.findUnique({
      where: { userId },
    });

    const teamInfo = {
      identifierKey: user?.identifierKey,
      telegramChatIds: chatIds?.telegramChatIds,
      discordChatIds: chatIds?.discordChatIds,
    };

    successReturnCall(res, HttpStatus.OK, teamInfo);
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_SERVER_ERROR,
    );
    return;
  }
};
