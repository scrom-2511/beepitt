import { SUBSCRIPTION_LIMITS } from '../../../config/subscriptionLimits.config';
import { ChatIdsInfo } from '../../types/applicationTypes';
import { UserWithOtherDetails } from '../../types/prismaTypes';
import { getProjectByProjectName } from './getProjectByProjectName.helper.';

type ChatIdsResult = ChatIdsInfo[];

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

  // Get users subscription tier
  const userSubscriptionTier = user.billing?.subscription_tier!;

  // Get max notifications recepients limit according to the subscription limit
  const maxRecepientsLimit = SUBSCRIPTION_LIMITS[userSubscriptionTier].maxRecepients;

  // Build and return the array of chat ids info for each channel
  return [
    buildChatIdsInfo('discord', maxRecepientsLimit, contactDetails?.discordChatIds),
    buildChatIdsInfo('telegram', maxRecepientsLimit, contactDetails?.telegramChatIds),
  ];
};

const buildChatIdsInfo = (
  channel: 'discord' | 'telegram',
  maxRecepientsLimit: number,
  chatIds?: string[],
): ChatIdsInfo => {
  // Get chat ids
  const ids = chatIds ?? [];

  // Return the chat ids info
  return {
    channel,
    present: ids.length > 0, // Set present according to the length of the chat ids
    chatIds: ids.slice(0, maxRecepientsLimit), // Select recepients according to users subscription limit
  };
};
