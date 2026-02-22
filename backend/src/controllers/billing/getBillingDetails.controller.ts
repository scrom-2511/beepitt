import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { errorReturnCall } from '../../helpers/returnCall/error.returnCall';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';

export const getBillingDetailsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.userId;

    const billingDetails = await prisma.billing.findUnique({
      where: {
        userId,
      },
    });
    
    successReturnCall(res, HttpStatus.OK, billingDetails);
    return;
  } catch (error) {
    console.log(error);
    errorReturnCall(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_SERVER_ERROR,
    );
    return;
  }
};
