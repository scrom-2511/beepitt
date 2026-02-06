import { produceMessageForMessageSender } from "../services/kafka/beepSender/producerMessageSender";
import { ProducerMessage } from "../types/dataTypes";

interface InputData {
  name: string;
  desc: string;
  userId: number;
  type: "issue" | "incident";
}

export const handleMessageSendingToClient = async(data: InputData) => {

  const dataToSend: ProducerMessage = {
    key: data.userId.toString(),
    value: JSON.stringify(data),
  };
  await produceMessageForMessageSender(dataToSend);
};