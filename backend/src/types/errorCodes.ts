export const ERROR_CODES = {
  INVALID_INPUT: {
    id: 1000,
    code: 'INVALID_INPUT',
    message: 'Please provide valid input or missing required fields.',
  },

  INVALID_ID: {
    id: 1001,
    code: 'INVALID_ID',
    message: 'Invalid resource identifier.',
  },

  UNAUTHORIZED: {
    id: 1100,
    code: 'UNAUTHORIZED',
    message: 'Authentication is required.',
  },

  USER_NOT_FOUND: {
    id: 1101,
    code: 'USER_NOT_FOUND',
    message: 'The details you entered does not belong to any user.',
  },

  INCORRECT_PASSWORD: {
    id: 1102,
    code: 'INCORRECT_PASSWORD',
    message: 'The password you entered is incorrect.',
  },

  FORBIDDEN: {
    id: 1103,
    code: 'FORBIDDEN',
    message: 'You do not have permission to perform this action.',
  },

  TOKEN_EXPIRED: {
    id: 1104,
    code: 'TOKEN_EXPIRED',
    message: 'Your session has expired. Please log in again.',
  },

  TOKEN_INVALID: {
    id: 1105,
    code: 'TOKEN_INVALID',
    message: 'Invalid authentication token.',
  },

  RESOURCE_NOT_FOUND: {
    id: 1200,
    code: 'RESOURCE_NOT_FOUND',
    message: 'Requested resource was not found.',
  },

  LINK_NOT_FOUND: {
    id: 1201,
    code: 'LINK_NOT_FOUND',
    message: 'Short link does not exist.',
  },

  DATA_ALREADY_EXISTS: {
    id: 1202,
    code: 'DATA_ALREADY_EXISTS',
    message: 'Data already exists.',
  },

  OPERATION_NOT_ALLOWED: {
    id: 1300,
    code: 'OPERATION_NOT_ALLOWED',
    message: 'This operation is not allowed.',
  },

  LIMIT_EXCEEDED: {
    id: 1301,
    code: 'LIMIT_EXCEEDED',
    message: 'You have exceeded the allowed limit.',
  },

  TOO_MANY_REQUESTS: {
    id: 1400,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many requests. Please try again later.',
  },

  SERVICE_UNAVAILABLE: {
    id: 1500,
    code: 'SERVICE_UNAVAILABLE',
    message: 'Service is temporarily unavailable.',
  },

  INTERNAL_SERVER_ERROR: {
    id: 1501,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong. Please try again later.',
  },

  OTP_VERIFICATION_NEEDED: {
    id: 1600,
    code: 'OTP_VERIFICATION_NEEDED',
    message: 'Verify otp from your email.',
  },

  INVALID_OTP: {
    id: 1601,
    code: 'INVALID_OTP',
    message: 'Entered otp is invalid.',
  },

  PROJECT_LIMIT_REACHED_FREE: {
    id: 1602,
    code: 'PROJECT_LIMIT_REACHED_FREE',
    message: 'Free plan allows upto 1 project only.',
  },

  PROJECT_LIMIT_REACHED_PREMIUM: {
    id: 1603,
    code: 'PROJECT_LIMIT_REACHED_PREMIUM',
    message: 'Premium plan allows upto 4 project only.',
  },
} as const;

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}
