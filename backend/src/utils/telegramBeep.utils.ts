import TelegramBot from 'node-telegram-bot-api';
import { SUBSCRIPTION_LIMITS } from '../../config/subscriptionLimits.config';
import { EventType } from '../../generated/prisma/enums';
import { prisma } from '../database/prismaClient';
import { SelectedIdentifierKey } from '../types/applicationTypes';

const token = process.env.TELEGRAM_SECRET_TOKEN!;

// Initialize Telegram bot in webhook mode
export const bot = new TelegramBot(token, { webHook: true });

// Register webhook
bot.setWebHook('https://francisco-unscholarlike-punctually.ngrok-free.dev/app/webhook/telegramBot', {
  secret_token: 'somethiadf',
});

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
    // Find project by identifier key
    const project = await prisma.project.findFirst({
      where: { OR: [{ identifierKey }, { identifierKey2: identifierKey }] },
      include: { contactDetails: true },
    });

    // If project doesnot exists, that means identifier key is wrong
    if (!project) {
      await bot.sendMessage(chatId, 'Wrong identifier key.');
      return;
    }

    // Get user along with billing details
    const user = await prisma.user.findUnique({ where: { id: project.userId }, select: { billing: true } });

    // If user doesnot exists, return
    if (!user) {
      await bot.sendMessage(chatId, 'User doesnt exist.');
      return;
    }

    // Get user's subscription tier
    const userSubscriptionTier = user.billing?.subscription_tier;

    // Determine which identifier key was used
    const selectedIdentifierKey: SelectedIdentifierKey =
      project.identifierKey === identifierKey
        ? SelectedIdentifierKey.identifierKey
        : SelectedIdentifierKey.identifierKey2;

    // Prevent usage of identifierKey2 if subscription tier is not pro
    if (selectedIdentifierKey === SelectedIdentifierKey.identifierKey2 && userSubscriptionTier != 'pro') {
      await bot.sendMessage(chatId, 'You subscription tier doesnot support separate recepients');
      return;
    }

    // Prisma transaction to handle concurrency safely
    await prisma.$transaction(async (tx) => {
      const contact = project.contactDetails; // Existing contact details for the project

      // Decide which field to update based on identifier key used
      const field =
        selectedIdentifierKey === SelectedIdentifierKey.identifierKey ? 'telegramChatIds' : 'telegramChatIds2';

      // If contactDetails record does not exist, create it
      if (!contact) {
        await tx.contactDetails.create({
          data: {
            projectId: project.id,
            [field]: [chatId], // Initialize chat ID for the selected field
          },
        });
        await bot.sendMessage(chatId, 'Telegram account linked.');
        return;
      }

      // Extract current list of chat IDs depending on identifier key
      const chatIds = contact[field] ?? [];

      // If Telegram account is already linked, inform user
      if (chatIds?.includes(chatId)) {
        await bot.sendMessage(chatId, 'This Telegram account is already linked.');
        return;
      }

      // Determine maximum allowed recipients for user's subscription
      const maxRecepients =
        field === "telegramChatIds"
          ? SUBSCRIPTION_LIMITS[userSubscriptionTier!].maxRecepients
          : SUBSCRIPTION_LIMITS[userSubscriptionTier!].maxRecepients2;

      // Extract number of linked chat IDs
      const count = chatIds.length;

      // If recipient limit reached, block linking
      if (count >= maxRecepients) {
        await bot.sendMessage(chatId, 'Max recepients linked. To link more recepients consider upgrading your plan.');
        return;
      }

      // Add new Telegram chat ID to the array
      await tx.contactDetails.update({
        where: { projectId: project.id },
        data: {
          [field]: { push: chatId },
        },
      });

      // Confirm successful linking
      await bot.sendMessage(chatId, 'Telegram account linked.');
      return;
    });
  } catch (error: any) {
    console.error(error);
    await bot.sendMessage(chatId, 'Internal Server Error.');
    return;
  }
});

export const telegramBeep = async (telegramChatIds: string[], type: EventType) => {
  try {
    if (!telegramChatIds.length) return;

    await Promise.allSettled(
      telegramChatIds.map((chatId) =>
        bot.sendMessage(
          chatId,
          type === 'issue' ? 'Backend issue detected, please check it' : 'Backend incident detected, please check it',
        ),
      ),
    );
  } catch {}
};