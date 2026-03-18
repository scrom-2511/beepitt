import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const getAllProjectsController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const allUserProjects = await prisma.project.findMany({
      where: { userId },
      select: { projectName: true, id: true, projectDesc: true },
    });

    successReturnCall(res, HttpStatus.OK, { allUserProjects });
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
