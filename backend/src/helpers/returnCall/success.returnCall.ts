import { Response } from 'express';
import { HttpStatus } from '../../types/errorCodes';

export const successReturnCall = (res: Response, statusCode: HttpStatus, data: any) => {
  res.status(statusCode).json({
    success: true,
    data,
  });

  return;
};
