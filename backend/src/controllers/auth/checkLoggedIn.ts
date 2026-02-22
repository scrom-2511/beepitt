import { Request, Response } from 'express';
import { successReturnCall } from '../../helpers/returnCall/success.returnCall';
import { HttpStatus } from '../../types/errorCodes';

export const checkLoggedIn = (req: Request, res: Response) => {
  successReturnCall(res, HttpStatus.OK, null);
  return;
};
