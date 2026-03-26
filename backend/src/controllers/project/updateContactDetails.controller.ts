import { Request, Response } from 'express';
import { SUBSCRIPTION_LIMITS } from '../../../config/subscriptionLimits.config';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { UpdateContactDetailsType } from '../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const updateContactDetailsController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const validateData = UpdateContactDetailsType.safeParse(req.body);

    if (!validateData.success) {
      return errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
    }

    const { projectId, emailIds, telegramChatIds, discordChatIds } = validateData.data;

    // Check if user owns the project and get their subscription tier
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: {
        id: true,
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

    const tier = project.user.billing?.subscription_tier;
    const limits = tier ? SUBSCRIPTION_LIMITS[tier] : SUBSCRIPTION_LIMITS['free'];
    const maxEmails = limits.maxRecepients;

    // Enforce email limit
    if (emailIds !== undefined && emailIds.length > maxEmails) {
      return errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.LIMIT_EXCEEDED);
    }

    const existingContactDetails = await prisma.contactDetails.findUnique({
      where: { projectId },
    });

    if (existingContactDetails) {
      await prisma.contactDetails.update({
        where: { projectId },
        data: {
          ...(emailIds !== undefined && { emailIds }),
          ...(telegramChatIds !== undefined && { telegramChatIds }),
          ...(discordChatIds !== undefined && { discordChatIds }),
        },
      });
    } else {
      await prisma.contactDetails.create({
        data: {
          projectId,
          emailIds: emailIds || [],
          telegramChatIds: telegramChatIds || [],
          discordChatIds: discordChatIds || [],
        },
      });
    }

    return successReturnCall(res, HttpStatus.OK, null);
  } catch (error) {
    console.error('Error in updateContactDetailsController:', error);
    return errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
  }
};
