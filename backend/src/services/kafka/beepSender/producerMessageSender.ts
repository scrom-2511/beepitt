// @ts-nocheck
import { ProducerMessage } from "../../../types/dataTypes";
import { producer } from "../producer";

export const produceMessageForMessageSender = async (
  message: ProducerMessage
) => {
  try {
    await producer.send({ topic: "message-sender", messages: [message] });
  } catch (error) {
    console.error(error);
  }
};
