import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { validate as isUUID } from 'uuid';
import { prisma } from '../database/prismaClient';
import { NotificationType } from '../types/dataTypes';

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

// Listen for new messages
discordClient.on('messageCreate', async (msg) => {
  try {
    if (!msg.author.id) return; // If there is no author ID, return
    if (msg.author.bot) return; // If the message is from a bot, return

    // If the message is from a guild/server, return
    if (msg.guild) return;

    // Get the Discord chat ID
    const chatId = msg.author.id;
    // Get the message text
    const msgText = msg.content;

    // If the message is "start", begin the linking process
    if (msgText.trim().toLowerCase() === 'start') {
      await msg.reply('Send your identifier key');
      return;
    }

    // If the message is not a valid UUID, return
    if (!isUUID(msgText.trim())) {
      await msg.reply('Please provide a valid identifier key');
      return;
    }

    // If the message is a valid UUID
    if (isUUID(msgText.trim())) {
      // Store the identifier key
      const identifierKey = msgText;

      // Find the user linked to the identifier key
      const user = await prisma.user.findUnique({
        where: { identifierKey },
        include: { billing: true },
      });

      // If no user is found, return
      if (!user) {
        msg.reply('Wrong identifier key!');
        return;
      }

      // Prisma transaction to safely handle concurrent requests
      await prisma.$transaction(async (tx) => {
        // Find existing contact details for the user
        const contact = await tx.contactDetails.findUnique({
          where: { userId: user.id },
          select: { discordChatIds: true },
        });

        // Create contact details if they do not exist
        if (!contact) {
          await tx.contactDetails.create({
            data: {
              userId: user.id,
              telegramChatIds: [],
              discordChatIds: [chatId],
            },
          });
          return;
        }

        // Prevent linking the same Discord account twice
        if (contact.discordChatIds.includes(chatId)) {
          throw new Error('ALREADY_LINKED');
        }

        // Get the number of linked Discord accounts
        const count = contact.discordChatIds.length;

        // Enforce limit for Free users
        if (user.billing?.subscription_tier === 'Free' && count >= 1) {
          throw new Error('FREE_LIMIT');
        }

        // Enforce limit for Premium users
        if (user.billing?.subscription_tier === 'Premium' && count >= 4) {
          throw new Error('PREMIUM_LIMIT');
        }

        // Add the new Discord chat ID
        await tx.contactDetails.update({
          where: { userId: user.id },
          data: {
            discordChatIds: { push: chatId },
          },
        });
      });

      // Notify the user that linking was successful
      await msg.reply('Discord account linked.');
      return;
    }
  } catch (error: any) {
    // Handle all the errors
    switch (error.message) {
      case 'ALREADY_LINKED':
        await msg.reply('This Discord account is already linked.');
        break;
      case 'FREE_LIMIT':
        await msg.reply('Upgrade to premium to add more members.');
        break;
      case 'PREMIUM_LIMIT':
        await msg.reply(
          'Maximum team members reached. Remove an existing one to add more.',
        );
        break;
      default:
        console.error(error);
        await msg.reply('Something went wrong. Please try again.');
    }
  }
});

export const discordBeep = async (
  discordChatIds: string[],
  type: NotificationType,
) => {
  try {
    await Promise.allSettled(
      discordChatIds.map(async (chatId) => {
        const user = await discordClient.users.fetch(chatId);
        await user.send(
          type === NotificationType.Incident
            ? 'There was an incident!'
            : 'There was an issue!',
        );
      }),
    );
  } catch (error) {
    console.error(error);
  }
};
