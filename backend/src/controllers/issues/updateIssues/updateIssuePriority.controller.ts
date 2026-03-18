import { Request, Response } from 'express';
import { prisma } from '../../../database/prismaClient';
import { errorReturnCall } from '../../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../../helpers/returnCall/success.returnCall';
import { UpdateIssuePriorityType } from '../../../types/dataTypes';
import { ErrorCode, HttpStatus } from '../../../types/errorCodes';

export const updateIssuePriorityController = async (req: Request, res: Response) => {
  try {
    const validateData = UpdateIssuePriorityType.safeParse(req.body);
    if (!validateData.success) {
      errorReturnCall(res, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT);
      return;
    }

    const isIssueClosed = validateData.data.issuePriority === 'Closed';

    await prisma.issue.update({
      where: { id: validateData.data.issueId },
      data: {
        issuePriority: validateData.data.issuePriority,
        issueResolveDateAndTime: isIssueClosed ? new Date() : null,
      },
    });

    successReturnCall(res, HttpStatus.OK, null);
    return;
  } catch (error) {
    console.error(error);
    errorReturnCall(res, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR);
    return;
  }
};
