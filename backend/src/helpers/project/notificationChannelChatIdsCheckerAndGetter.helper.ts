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
  // Find project linked to the user by project name
  const project = user.project.find((p) => p.projectName === projectName.toLowerCase());

  // If project does not exists return
  if (!project) {
    throw new Error('Project not found');
  }

  // Get the contact details of the project
  const contactDetails = project.contactDetails;

  const discordChatIds = contactDetails?.discordChatIds ?? [];
  const telegramChatIds = contactDetails?.telegramChatIds ?? [];

  const discordChatIdsPresent = discordChatIds.length > 0;
  const telegramChatIdsPresent = telegramChatIds.length > 0;

  return { discordChatIdsPresent, telegramChatIdsPresent, discordChatIds, telegramChatIds };
};
