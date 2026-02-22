import { Request, Response } from 'express';
import { prisma } from '../../../database/prismaClient';
import { errorReturnCall } from '../../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../../helpers/returnCall/success.returnCall';
import { UpdateIncidentSeenType } from '../../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../../types/errorCodes';

export const updateIncidentSeenController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validateData = UpdateIncidentSeenType.safeParse(req.body);
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    await prisma.incident.update({
      where: { id: validateData.data.incidentId },
      data: {
        incidentSeen: true,
        incidentSeenDateAndTime: new Date(),
      },
    });

    successReturnCall(res, HttpStatus.OK, null);
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_SERVER_ERROR,
    );
  }
};
