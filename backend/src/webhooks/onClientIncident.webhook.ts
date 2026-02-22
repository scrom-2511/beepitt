import { Request, Response } from 'express';
import { prisma } from '../database/prismaClient';
import { enqueueDiscordNotifications } from '../services/bullmq/producers/discordNotifications.producer';
import { enqueueTelegramNotifications } from '../services/bullmq/producers/telegramNotifications.producer';
import { NotificationType, onClientIncidentType } from '../types/dataTypes';
import { ERROR_CODES, HttpStatus } from '../types/errorCodes';

export const onClientIncidentWebhook = async (req: Request, res: Response) => {
  try {
    const validateData = onClientIncidentType.safeParse(req.body);
    console.log(req.body);

    if (!validateData.success) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          id: ERROR_CODES.INVALID_INPUT.code,
          code: ERROR_CODES.INVALID_INPUT.code,
          message: ERROR_CODES.INVALID_INPUT.message,
        },
      });
      return;
    }

    const userId = req.userId!;
    let telegramChatIdsPresent = false;
    let discordChatIdsPresent = false;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { contactDetails: true, billing: true },
    });

    if (user?.billing?.subscription_tier === 'Free') {
      const projectName = validateData.data.projectName.toLowerCase();

      if (user.projects.length === 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            projects: [projectName],
          },
        });
      } else if (user.projects[0] !== projectName) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          error: {
            code: ERROR_CODES.PROJECT_LIMIT_REACHED_FREE.code,
            message: ERROR_CODES.PROJECT_LIMIT_REACHED_FREE.message,
          },
        });
        return;
      }
    } else if (user?.billing?.subscription_tier === 'Premium') {
      const projectName = validateData.data.projectName.toLowerCase();
      const projects = user.projects ?? [];

      if (projects.includes(projectName)) {
        return;
      }

      if (projects.length < 4) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            projects: [...projects, projectName],
          },
        });
      } else {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          error: {
            code: ERROR_CODES.PROJECT_LIMIT_REACHED_PREMIUM.code,
            message: ERROR_CODES.PROJECT_LIMIT_REACHED_PREMIUM.message,
          },
        });
        return;
      }
    }

    const contactDetails = user?.contactDetails;

    if (
      contactDetails?.discordChatIds.length &&
      contactDetails.discordChatIds.length > 0
    ) {
      discordChatIdsPresent = true;
      await enqueueDiscordNotifications({
        userId: req.userId!,
        data: contactDetails.discordChatIds,
        type: NotificationType.Incident,
      });
    }

    if (
      contactDetails?.telegramChatIds.length &&
      contactDetails.telegramChatIds.length > 0
    ) {
      telegramChatIdsPresent = true;
      await enqueueTelegramNotifications({
        userId: req.userId!,
        data: contactDetails.telegramChatIds,
        type: NotificationType.Incident,
      });
    }

    await prisma.incident.create({
      data: { ...validateData.data, userId },
    });

    if (!discordChatIdsPresent) {
      res.status(HttpStatus.CONFLICT).json({
        success: false,
        error: {
          message: 'No discord accounts linked!',
        },
      });
    } else if (!telegramChatIdsPresent) {
      res.status(HttpStatus.CONFLICT).json({
        success: false,
        error: {
          message: 'No telegram accounts linked!',
        },
      });
    } else {
      res.status(HttpStatus.OK).json({
        success: true,
      });
    }

    return;
  } catch (error) {}
};
