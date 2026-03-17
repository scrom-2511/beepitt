import type { Key } from 'react';

export interface ErrMsgObj {
  errName: string;
  errMsg: string;
  errStack: string;
}

export interface AiRecommendation {
  theCause: string;
  theSolution: string;
}

export interface ErrMsg {
  _id: Key;
  userID: string;
  filePath: string;
  solved: boolean;
  errMsgObj: ErrMsgObj;
  time: string;
  createdAt: string;
  aiRecommendation: AiRecommendation;
}
