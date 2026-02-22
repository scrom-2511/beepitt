import { discordBeep } from '../../../utils/discordBeep.util';
import { telegramBeep } from '../../../utils/telegramBeep.utils';
import { kafka } from '../kafkaClient';
import { producerBeepSenderRetry } from './producerBeepRetry';

const consumer = kafka.consumer({ groupId: 'beep-sender-retry-consumer' });
await consumer.connect();

interface RetryQueueMessage {
  telegramChatIds: string[];
  discordChatIds: string[];
  retryNumber: number;
}

export const consumerBeepMessageSenderRetry = async () => {
  consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message, heartbeat }) => {
      if (!message.value || !message.key) return;

      const parsedMessage: RetryQueueMessage = JSON.parse(
        message.value.toString(),
      );

      try {
        await heartbeat();

        await telegramBeep(parsedMessage.telegramChatIds);
        await discordBeep(parsedMessage.discordChatIds);

        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (Number(message.offset) + 1).toString(),
          },
        ]);
      } catch (error) {
        const nextRetry = parsedMessage.retryNumber + 1;

        if (nextRetry > 5) {
          console.error('Max retries reached. Sending to DLQ.', parsedMessage);

          await consumer.commitOffsets([
            {
              topic,
              partition,
              offset: (Number(message.offset) + 1).toString(),
            },
          ]);

          return;
        }

        const retryPayload: RetryQueueMessage = {
          ...parsedMessage,
          retryNumber: nextRetry,
        };

        await producerBeepSenderRetry({
          key: message.key.toString(),
          value: JSON.stringify(retryPayload),
        });

        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (Number(message.offset) + 1).toString(),
          },
        ]);
      }
    },
  });
};