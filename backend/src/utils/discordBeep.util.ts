import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { SUBSCRIPTION_LIMITS } from '../../config/subscriptionLimits.config';
import { EventType } from '../../generated/prisma/enums';
import { prisma } from '../database/prismaClient';
import { SelectedIdentifierKey } from '../types/applicationTypes';

// Create a new Discord client with required intents
export const discordClient = new Client({
  intents: [
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

console.log('discord file loaded');
discordClient.on('ready', () => {
  console.log('READY EVENT FIRED');
});
discordClient.login(process.env.DISCORD_SECRET_TOKEN);

// Listen for direct messages
discordClient.on('messageCreate', async (msg) => {
  try {
    if (msg.author.bot) return; // Ignore bot messages
    if (msg.guild) return; // Ignore server messages

    const chatId = msg.author.id;
    const text = msg.content?.trim();

    if (!text) return;

    // Handle start command
    if (text.toLowerCase() === 'start') {
      await msg.reply('Send your identifier key');
      return;
    }

    const identifierKey = text;

    // Find project by identifier key
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ identifierKey }, { identifierKey2: identifierKey }],
      },
      include: { contactDetails: true },
    });

    // If project doesnot exists, that means identifier key is wrong
    if (!project) {
      await msg.reply('Wrong identifier key.');
      return;
    }

    // Get user along with billing details
    const user = await prisma.user.findUnique({
      where: { id: project.userId },
      select: { billing: true },
    });

    // If user doesnot exists, return
    if (!user) {
      await msg.reply('User does not exist.');
      return;
    }

    // Get user's subscription tier
    const subscriptionTier = user.billing?.subscription_tier;

    // Determine which identifier key was used
    const selectedIdentifierKey: SelectedIdentifierKey =
      project.identifierKey === identifierKey
        ? SelectedIdentifierKey.identifierKey
        : SelectedIdentifierKey.identifierKey2;

    // Prevent usage of identifierKey2 if subscription tier is not pro
    if (selectedIdentifierKey === SelectedIdentifierKey.identifierKey2 && subscriptionTier !== 'pro') {
      await msg.reply('Your subscription tier does not support separate recipients.');
      return;
    }

    // Prisma transaction to handle concurrency safely
    await prisma.$transaction(async (tx) => {
      const contact = project.contactDetails; // Existing contact details for the project

      // Decide which field to update based on identifier key used
      const field =
        selectedIdentifierKey === SelectedIdentifierKey.identifierKey ? 'discordChatIds' : 'discordChatIds2';

      // If contactDetails record does not exist, create it
      if (!contact) {
        await tx.contactDetails.create({
          data: {
            projectId: project.id,
            [field]: [chatId], // Initialize chat ID for the selected field
          },
        });

        await msg.reply('Discord account linked.');
        return;
      }

      // Extract current list of chat IDs depending on identifier key
      const chatIds = contact[field] ?? [];

      // If Discord account is already linked, inform user
      if (chatIds.includes(chatId)) {
        await msg.reply('This Discord account is already linked.');
        return;
      }

      // Determine maximum allowed recipients for user's subscription
      const maxRecipients =
        field === 'discordChatIds'
          ? SUBSCRIPTION_LIMITS[subscriptionTier!].maxRecepients
          : SUBSCRIPTION_LIMITS[subscriptionTier!].maxRecepients2;

      // Extract number of linked chat IDs
      const count = chatIds.length;

      // If recipient limit reached, block linking
      if (count >= maxRecipients) {
        await msg.reply('Maximum recipients reached. Upgrade your plan to add more.');
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
      await msg.reply('Discord account linked.');
      return;
    });
  } catch (error) {
    console.error(error);
    await msg.reply('Internal Server Error.');
    return;
  }
});

export const discordBeep = async (discordChatIds: string[], type: EventType) => {
  try {
    await Promise.allSettled(
      discordChatIds.map(async (chatId) => {
        const user = await discordClient.users.fetch(chatId);
        await user.send(type === 'incident' ? 'There was an incident!' : 'There was an issue!');
      }),
    );
  } catch (error) {
    console.error(error);
  }
};
