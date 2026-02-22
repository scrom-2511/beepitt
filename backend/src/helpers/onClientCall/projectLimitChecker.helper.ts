import { Request, Response } from 'express';
import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../database/prismaClient';
import { ERROR_CODES, HttpStatus } from '../../types/errorCodes';

type UserWithOtherDetails = Prisma.UserGetPayload<{
  include: { contactDetails: true; billing: true; projectDetails: true };
}>;

export const projectLimitChecker = async (
  req: Request,
  res: Response,
  projectName: string,
  user: UserWithOtherDetails | null,
) => {
  try {
    const projectDetails = user?.projectDetails;
    const userId = req.userId!;

    if (user?.billing?.subscription_tier === 'Free') {
      projectName = projectName.toLowerCase();

      if (projectDetails?.projects.length === 0) {
        await prisma.projectDetails.update({
          where: { id: userId },
          data: {
            projects: [projectName],
          },
        });
      } else if (projectDetails?.projects[0] !== projectName) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          error: {
            code: ERROR_CODES.PROJECT_LIMIT_REACHED_FREE.code,
            message: ERROR_CODES.PROJECT_LIMIT_REACHED_FREE.message,
          },
        });
        return;
      }
    } else if (user?.billing?.subscription_tier === 'Starter') {
      projectName = projectName.toLowerCase();
      const projects = projectDetails?.projects ?? [];

      if (projects.includes(projectName)) {
        return;
      }

      if (projects.length < 4) {
        await prisma.projectDetails.update({
          where: { id: userId },
          data: {
            projects: [...projects, projectName],
          },
        });
      } else {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          error: {
            code: ERROR_CODES.PROJECT_LIMIT_REACHED_STARTER.code,
            message: ERROR_CODES.PROJECT_LIMIT_REACHED_STARTER.message,
          },
        });
        return;
      }
    }
  } catch (error) {}
};
