import { ProducerMessage } from '../../../types/dataTypes';
import { producer } from '../producer';

export const producerBeepSenderRetry = (message: ProducerMessage) => {
  try {
    producer.send({ topic: 'beep-sender-retry', messages: [message] });
  } catch (error) {
    console.log('Some error', error);
  }
};
