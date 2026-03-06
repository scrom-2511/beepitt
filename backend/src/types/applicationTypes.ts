import { NotificationChannels } from "../../generated/prisma/enums";
import { NotificationType } from "./dataTypes";

export type NotificationJob = {
  userId: number;
  type: NotificationType;
  data: string[];
}

export type ChatIdsInfo = {
  channel: NotificationChannels;
  present: boolean;
  chatIds: string[];
};
