import { EventType, NotificationChannels } from '../../generated/prisma/enums';

export type NotificationJob = {
  userId: number;
  type: EventType;
  data: string[];
  jobId: string;
  delay: number;
};

export type ChatIdsInfo = {
  channel: NotificationChannels;
  present: boolean;
  chatIds: string[];
};

export type EventIdAndType = {
  id: number;
  type: EventType;
};

export enum SelectedIdentifierKey {
  identifierKey,
  identifierKey2,
}