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

  PROJECT_LIMIT_REACHED_STARTER: {
    id: 1603,
    code: 'PROJECT_LIMIT_REACHED_STARTER',
    message: 'Starter plan allows upto 4 project only.',
  },
} as const;

export enum ErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_ID = 'INVALID_ID',
  UNAUTHORIZED = 'UNAUTHORIZED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  LINK_NOT_FOUND = 'LINK_NOT_FOUND',
  DATA_ALREADY_EXISTS = 'DATA_ALREADY_EXISTS',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  OTP_VERIFICATION_NEEDED = 'OTP_VERIFICATION_NEEDED',
  INVALID_OTP = 'INVALID_OTP',
  PROJECT_LIMIT_REACHED_FREE = 'PROJECT_LIMIT_REACHED_FREE',
  PROJECT_LIMIT_REACHED_STARTER = 'PROJECT_LIMIT_REACHED_STARTER',
  PROJECT_LIMIT_REACHED_PRO = 'PROJECT_LIMIT_REACHED_PRO',
  EVENTS_LIMIT_REACHED = 'EVENTS_LIMIT_REACHED',
  PROJECT_NOT_FOUND = 'PROJECT_NOT_FOUND',
  NO_NOTIFICATION_CHANNEL_LINKED = 'NO_NOTIFICATION_CHANNEL_LINKED',
  PROJECT_ALREADY_EXISTS = 'PROJECT_ALREADY_EXISTS',
  NOTIFICATION_CHANNEL_LIMIT_REACHED_FREE = 'NOTIFICATION_CHANNEL_LIMIT_REACHED_FREE',
  NOTIFICATION_CHANNEL_LIMIT_REACHED_STARTER = 'NOTIFICATION_CHANNEL_LIMIT_REACHED_STARTER',
  NOTIFICATION_CHANNEL_LIMIT_REACHED_PRO = 'NOTIFICATION_CHANNEL_LIMIT_REACHED_PRO',
}

type ErrorMeta = {
  id: number;
  message: string;
};

export const ERROR_METADATA: Record<ErrorCode, ErrorMeta> = {
  [ErrorCode.INVALID_INPUT]: {
    id: 1000,
    message: 'Please provide valid input or missing required fields.',
  },

  [ErrorCode.INVALID_ID]: {
    id: 1001,
    message: 'Invalid resource identifier.',
  },

  [ErrorCode.UNAUTHORIZED]: {
    id: 1100,
    message: 'Authentication is required.',
  },

  [ErrorCode.USER_NOT_FOUND]: {
    id: 1101,
    message: 'The details you entered does not belong to any user.',
  },

  [ErrorCode.INCORRECT_PASSWORD]: {
    id: 1102,
    message: 'The password you entered is incorrect.',
  },

  [ErrorCode.FORBIDDEN]: {
    id: 1103,
    message: 'You do not have permission to perform this action.',
  },

  [ErrorCode.TOKEN_EXPIRED]: {
    id: 1104,
    message: 'Your session has expired. Please log in again.',
  },

  [ErrorCode.TOKEN_INVALID]: {
    id: 1105,
    message: 'Invalid authentication token.',
  },

  [ErrorCode.RESOURCE_NOT_FOUND]: {
    id: 1200,
    message: 'Requested resource was not found.',
  },

  [ErrorCode.LINK_NOT_FOUND]: {
    id: 1201,
    message: 'Short link does not exist.',
  },

  [ErrorCode.DATA_ALREADY_EXISTS]: {
    id: 1202,
    message: 'Data already exists.',
  },

  [ErrorCode.OPERATION_NOT_ALLOWED]: {
    id: 1300,
    message: 'This operation is not allowed.',
  },

  [ErrorCode.LIMIT_EXCEEDED]: {
    id: 1301,
    message: 'You have exceeded the allowed limit.',
  },

  [ErrorCode.TOO_MANY_REQUESTS]: {
    id: 1400,
    message: 'Too many requests. Please try again later.',
  },

  [ErrorCode.SERVICE_UNAVAILABLE]: {
    id: 1500,
    message: 'Service is temporarily unavailable.',
  },

  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    id: 1501,
    message: 'Something went wrong. Please try again later.',
  },

  [ErrorCode.OTP_VERIFICATION_NEEDED]: {
    id: 1600,
    message: 'Verify otp from your email.',
  },

  [ErrorCode.INVALID_OTP]: {
    id: 1601,
    message: 'Entered otp is invalid.',
  },

  [ErrorCode.PROJECT_LIMIT_REACHED_FREE]: {
    id: 1701,
    message: 'Free plan allows upto 1 project only.',
  },

  [ErrorCode.PROJECT_LIMIT_REACHED_STARTER]: {
    id: 1702,
    message: 'Starter plan allows upto 4 project only.',
  },

  [ErrorCode.PROJECT_LIMIT_REACHED_PRO]: {
    id: 1703,
    message: 'Starter plan allows upto 8 project only.',
  },

  [ErrorCode.EVENTS_LIMIT_REACHED]: {
    id: 1704,
    message: 'The monthly limit for events has been reached. To receive more incidents, please upgrade your plan.',
  },

  [ErrorCode.PROJECT_NOT_FOUND]: {
    id: 1706,
    message: 'No project was found with this name, please create one.',
  },

  [ErrorCode.NO_NOTIFICATION_CHANNEL_LINKED]: {
    id: 1707,
    message:
      'No notification channel is linked to send event notifications. To get notifications on an event link notification channels.',
  },

  [ErrorCode.PROJECT_ALREADY_EXISTS]: {
    id: 1708,
    message: 'Project with this project name already exists, make sure all of your projects has unique names.',
  },

  [ErrorCode.NOTIFICATION_CHANNEL_LIMIT_REACHED_FREE]: {
    id: 1709,
    message: 'Free plan allows up to 1 notification channel only.',
  },

  [ErrorCode.NOTIFICATION_CHANNEL_LIMIT_REACHED_STARTER]: {
    id: 1710,
    message: 'Starter plan allows up to 4 notification channels only.',
  },

  [ErrorCode.NOTIFICATION_CHANNEL_LIMIT_REACHED_PRO]: {
    id: 1711,
    message: 'Pro plan allows up to 8 notification channels only.',
  },
};

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
