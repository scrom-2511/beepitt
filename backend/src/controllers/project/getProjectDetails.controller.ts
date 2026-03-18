import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const getProjectDetailsController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const projectId = Number(req.params.projectId);

    console.log('projectId is: ');
    console.log(projectId);

    if (!projectId) {
      return errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.PROJECT_NOT_FOUND);
    }

    // Fetch project info with contact details and user's billing
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: {
        projectName: true,
        projectDesc: true,
        identifierKey: true,
        contactDetails: {
          select: {
            telegramChatIds: true,
            telegramChatIds2: true,
            discordChatIds: true,
            discordChatIds2: true,
          },
        },
        user: {
          select: {
            billing: {
              select: {
                subscription_tier: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return errorReturnCall(res, HttpStatus.NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND);
    }

    const { billing } = project.user;

    // Only show the "pro" tier extra chat IDs
    const contactDetails = {
      telegramChatIds: project.contactDetails?.telegramChatIds || [],
      discordChatIds: project.contactDetails?.discordChatIds || [],
      telegramChatIds2:
        billing?.subscription_tier === 'pro' ? project.contactDetails?.telegramChatIds2 || [] : undefined,
      discordChatIds2: billing?.subscription_tier === 'pro' ? project.contactDetails?.discordChatIds2 || [] : undefined,
    };

    const response = {
      projectName: project.projectName,
      projectDesc: project.projectDesc,
      identifierKey: project.identifierKey,
      contactDetails,
    };

    successReturnCall(res, HttpStatus.OK, response);
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
