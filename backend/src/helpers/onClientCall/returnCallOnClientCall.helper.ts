import { Response } from 'express';
import { ChatIdsInfo } from '../../types/applicationTypes';
import { ErrorCode, HttpStatus } from '../../types/errorCodes';
import { errorReturnCall } from '../returnCall/error.returnCall';
import { successReturnCall } from '../returnCall/success.returnCall';

export const returnCallOnClientCall = (res: Response, allChatIdsInfo: ChatIdsInfo[]) => {
  // Check if at least channels chat ids are present
  const atLeastOneIdIsPresent = allChatIdsInfo.some((channelInfo) => channelInfo.present);

  // If preset return success else error
  if (atLeastOneIdIsPresent) {
    successReturnCall(res, HttpStatus.OK, null);
  } else {
    errorReturnCall(res, HttpStatus.CONFLICT, ErrorCode.NO_NOTIFICATION_CHANNEL_LINKED);
  }

  return;
};
