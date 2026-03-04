import { Prisma } from '../../../generated/prisma/client';
import { getProjectByProjectName } from './getProjectByProjectName.helper.';

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

export const notificationChannelChatIdsCheckerAndGetter = (
  projectName: string,
  user: UserWithOtherDetails,
): ChatIdsResult => {
  // Find project linked to the user by project name
  const project = getProjectByProjectName(projectName, user);

  // If project does not exists return
  if (!project) {
    throw new Error('Project not found');
  }

  // Get the contact details of the project
  const contactDetails = project.contactDetails;

  // Get the chat ids of each channel
  const discordChatIds = contactDetails?.discordChatIds ?? [];
  const telegramChatIds = contactDetails?.telegramChatIds ?? [];

  // Set the values of each according to the chat ids
  const discordChatIdsPresent = discordChatIds.length > 0;
  const telegramChatIdsPresent = telegramChatIds.length > 0;

  return { discordChatIdsPresent, telegramChatIdsPresent, discordChatIds, telegramChatIds };
};
