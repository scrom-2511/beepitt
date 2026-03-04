import { Prisma } from '../../../generated/prisma/client';

type UserWithOtherDetails = Prisma.UserGetPayload<{
  include: {
    billing: true;
    project: {
      include: {
        contactDetails: true;
      };
    };
  };
}>;

type ChatIdsResult = {
  discordChatIdsPresent: boolean;
  telegramChatIdsPresent: boolean;
  discordChatIds: string[];
  telegramChatIds: string[];
};

export const notificationChannelChatIdsCheckerAndGetter = async (
  projectName: string,
  user: UserWithOtherDetails,
): Promise<ChatIdsResult> => {
  const project = user.project.find((p) => p.projectName === projectName.toLowerCase());

  if (!project) {
    throw new Error('Project not found');
  }

  const contactDetails = project.contactDetails;

  const discordChatIds = contactDetails?.discordChatIds ?? [];
  const telegramChatIds = contactDetails?.telegramChatIds ?? [];

  const discordChatIdsPresent = discordChatIds.length > 0;
  const telegramChatIdsPresent = telegramChatIds.length > 0;

  return { discordChatIdsPresent, telegramChatIdsPresent, discordChatIds, telegramChatIds };
};
