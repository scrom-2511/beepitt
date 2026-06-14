import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ERROR_CODES, HttpStatus } from '../types/errorCodes';

let jwtSecret = process.env.JWT_SECRET;

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!jwtSecret) {
    jwtSecret = 'somethingboi';
  }

  let { authToken } = req.cookies;

  if (!authToken) {
    authToken = req.get('Authorization');
  }

  console.log("authToken is: ");
  console.log(authToken);

  if (!authToken) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      error: {
        id: ERROR_CODES.UNAUTHORIZED.id,
        code: ERROR_CODES.UNAUTHORIZED.code,
        message: ERROR_CODES.UNAUTHORIZED.message,
      },
    });
    return;
  }

  try {
    const decoded = jwt.verify(authToken, jwtSecret) as JwtPayload;

    if (!decoded?.id) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: {
          id: ERROR_CODES.UNAUTHORIZED.id,
          code: ERROR_CODES.UNAUTHORIZED.code,
          message: ERROR_CODES.UNAUTHORIZED.message,
        },
      });
      return;
    }

    req.userId = decoded.id;

    console.log("req.userId is: ");
    console.log(req.userId);
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
