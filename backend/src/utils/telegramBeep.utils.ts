import TelegramBot from 'node-telegram-bot-api';
import { prisma } from '../database/prismaClient';
import { NotificationType } from '../types/dataTypes';

const token = process.env.TELEGRAM_SECRET_TOKEN!;

// Initialize Telegram bot in webhook mode
export const bot = new TelegramBot(token, { webHook: true });

// Register webhook
bot.setWebHook(
  'https://francisco-unscholarlike-punctually.ngrok-free.dev/app/webhook/telegramBot',
  {
    secret_token: 'somethiadf',
  },
);

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hey tell give me the identifier key');
});

// Handle incoming messages
bot.on('message', async (msg) => {
  if (!msg.text || msg.text.startsWith('/')) return;

  const chatId = msg.chat.id.toString();
  const identifierKey = msg.text.trim();

  try {
    // Find user by identifier key
    const user = await prisma.user.findUnique({
      where: { identifierKey },
      include: { billing: true },
    });

    if (!user) {
      await bot.sendMessage(chatId, 'Wrong identifier key.');
      return;
    }

    // Prisma transaction to handle concurrency safely
    await prisma.$transaction(async (tx) => {
      const contact = await tx.contactDetails.findUnique({
        where: { userId: user.id },
        select: { telegramChatIds: true },
      });

      // Create contact details if they do not exist
      if (!contact) {
        await tx.contactDetails.create({
          data: {
            userId: user.id,
            telegramChatIds: [chatId],
            discordChatIds: [],
          },
        });
        await bot.sendMessage(chatId, 'Telegram account linked.');
        return;
      }

      // Prevent linking the same Telegram account twice
      if (contact.telegramChatIds.includes(chatId)) {
        throw new Error('ALREADY_LINKED');
      }

      const count = contact.telegramChatIds.length;

      // Enforce limit for Free users
      if (user.billing?.subscription_tier === 'Free' && count >= 1) {
        throw new Error('FREE_LIMIT');
      }

      // Enforce limit for Premium users
      if (user.billing?.subscription_tier === 'Premium' && count >= 4) {
        throw new Error('PREMIUM_LIMIT');
      }

      // Add Telegram chat ID
      await tx.contactDetails.update({
        where: { userId: user.id },
        data: {
          telegramChatIds: { push: chatId },
        },
      });
      await bot.sendMessage(chatId, 'Telegram account linked.');
    });
  } catch (error: any) {
    // Handle known business errors
    switch (error.message) {
      case 'ALREADY_LINKED':
        await bot.sendMessage(
          chatId,
          'This Telegram account is already linked.',
        );
        break;

      case 'FREE_LIMIT':
        await bot.sendMessage(
          chatId,
          'Upgrade to premium to add more members.',
        );
        break;

      case 'PREMIUM_LIMIT':
        await bot.sendMessage(
          chatId,
          'Maximum team members reached. Remove an existing one to add more.',
        );
        break;

      default:
        console.error(error);
        await bot.sendMessage(
          chatId,
          'Something went wrong. Please try again.',
        );
    }
  }
});

// // src/bot/index.ts
// import { prisma } from '../database/prismaClient';
// import { NotificationType } from '../types/dataTypes';
// import { TelegramBot } from './telegramBot';

// const token = process.env.TELEGRAM_SECRET_TOKEN!;
// export const bot = new TelegramBot(token, { webHook: true });

// await bot.deleteWebHook();

// await bot.setWebHook(
//   'https://francisco-unscholarlike-punctually.ngrok-free.dev/app/webhook/telegramBot',
//   {
//     secret_token: 'somethiadf',
//   },
// );

// // /start command
// bot.onText(/\/start/, async (msg) => {
//   const chatId = msg.chat.id;
//   await bot.sendMessage(chatId, 'Hey tell give me the identifier key');
// });

// // Message handler
// bot.on('message', async (msg) => {
//   if (!msg.text || msg.text.startsWith('/')) return;

//   const chatId = msg.chat.id.toString();
//   const identifierKey = msg.text.trim();

//   try {
//     const user = await prisma.user.findUnique({
//       where: { identifierKey },
//     });

//     if (!user) {
//       await bot.sendMessage(chatId, 'Wrong identifier key.');
//       return;
//     }

//     await prisma.$transaction(async (tx) => {
//       const contact = await tx.contactDetails.findUnique({
//         where: { userId: user.id },
//         select: { telegramChatIds: true },
//       });

//       if (!contact) {
//         await tx.contactDetails.create({
//           data: {
//             userId: user.id,
//             telegramChatIds: [chatId],
//             discordChatIds: [],
//           },
//         });

//         await bot.sendMessage(chatId, 'Telegram account linked.');
//         return;
//       }

//       if (contact.telegramChatIds.includes(chatId)) {
//         throw new Error('ALREADY_LINKED');
//       }

//       const count = contact.telegramChatIds.length;

//       if (user.subscription_tier === 'Free' && count >= 1) {
//         throw new Error('FREE_LIMIT');
//       }

//       if (user.subscription_tier === 'Premium' && count >= 4) {
//         throw new Error('PREMIUM_LIMIT');
//       }

//       await tx.contactDetails.update({
//         where: { userId: user.id },
//         data: {
//           telegramChatIds: { push: chatId },
//         },
//       });

//       await bot.sendMessage(chatId, 'Telegram account linked.');
//     });
//   } catch (error: any) {
//     switch (error.message) {
//       case 'ALREADY_LINKED':
//         await bot.sendMessage(chatId, 'This Telegram account is already linked.');
//         break;

//       case 'FREE_LIMIT':
//         await bot.sendMessage(chatId, 'Upgrade to premium to add more members.');
//         break;

//       case 'PREMIUM_LIMIT':
//         await bot.sendMessage(
//           chatId,
//           'Maximum team members reached. Remove an existing one to add more.',
//         );
//         break;

//       default:
//         console.error(error);
//         await bot.sendMessage(chatId, 'Something went wrong. Please try again.');
//     }
//   }
// });

// Send alert messages to all linked Telegram chats
export const telegramBeep = async (
  telegramChatIds: string[],
  type: NotificationType,
) => {
  try {
    if (!telegramChatIds.length) return;

    await Promise.allSettled(
      telegramChatIds.map((chatId) =>
        bot.sendMessage(
          chatId,
          type === NotificationType.Issue
            ? 'Backend issue detected, please check it'
            : 'Backend incident detected, please check it',
        ),
      ),
    );
  } catch {}
};
