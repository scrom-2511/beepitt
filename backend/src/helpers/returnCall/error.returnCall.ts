import { Response } from 'express';
import { ERROR_METADATA, ErrorCode, HttpStatus } from '../../types/errorCodes';

export const errorReturnCall = (res: Response, statusCode: HttpStatus, errorCode: ErrorCode) => {
  const meta = ERROR_METADATA[errorCode];

  res.status(statusCode).json({
    success: false,
    error: {
      id: meta.id,
      code: errorCode,
      message: meta.message,
    },
  });
};
