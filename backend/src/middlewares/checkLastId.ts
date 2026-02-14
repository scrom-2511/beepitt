import { NextFunction, Request, Response } from 'express';
import { ERROR_CODES, HttpStatus } from '../types/errorCodes';

export const checkLastId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lastIdRaw = req.query.lastId;
    const lastId = lastIdRaw ? Number(lastIdRaw) : null;

    if (lastIdRaw && Number.isNaN(lastId)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          id: ERROR_CODES.INVALID_INPUT.id,
          code: ERROR_CODES.INVALID_INPUT.code,
          message: 'Invalid lastId',
        },
      });
    }

    next();
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        id: ERROR_CODES.INTERNAL_SERVER_ERROR.id,
        code: ERROR_CODES.INTERNAL_SERVER_ERROR.code,
        message: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
      },
    });
    return;
  }
};
