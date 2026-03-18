import { prisma } from '../../../database/prismaClient';
import { beepitt } from '../../../utils/beepitt.util';
import { kafka } from '../kafkaClient';

const consumer = kafka.consumer({
  groupId: `message-sender-consumer-${process.pid}`,
});

export const consumerConnect = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'message-sender' });
};

export const consumeMessageForMessageSender = async () => {
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ message, heartbeat, topic, partition }) => {
      try {
        if (!message.value || !message.key) return;

        const payload = JSON.parse(message.value.toString());
        const userId = Number(message.key.toString());

        await heartbeat();

        const contact = await prisma.contactDetails.findUnique({
          where: { userId },
        });

        if (!contact) {
          await consumer.commitOffsets([
            {
              topic,
              partition,
              offset: (Number(message.offset) + 1).toString(),
            },
          ]);
          return;
        }

        await beepitt(contact.discordChatIds, contact.telegramChatIds);

        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (Number(message.offset) + 1).toString(),
          },
        ]);
      } catch (err) {
        console.error('Message sender failed:', err);
      }
    },
  });
};
