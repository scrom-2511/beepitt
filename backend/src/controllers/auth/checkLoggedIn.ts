import { Request, Response } from 'express';
import { HttpStatus } from '../../types/errorCodes';

export const checkLoggedIn = (req: Request, res: Response) => {
  res.status(HttpStatus.OK).json({
    success: true,
  });
  return;
};
