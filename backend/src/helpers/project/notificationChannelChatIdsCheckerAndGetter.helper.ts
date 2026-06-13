import { SUBSCRIPTION_LIMITS } from '../../../config/subscriptionLimits.config';
import { EventType, SubscriptionTier } from '../../../generated/prisma/enums';
import { ContactDetailsGetPayload } from '../../../generated/prisma/models';
import { ChatIdsInfo } from '../../types/applicationTypes';
import { UserWithBillingConfigurationProjectContactDetails } from '../../types/prismaTypes';
import { getProjectByProjectName, hasProjectContactDetails } from './getProjectByProjectName.helper.';

type ChatIdsResult = ChatIdsInfo[];

export const notificationChannelChatIdsCheckerAndGetter = (
  projectName: string,
  user: UserWithBillingConfigurationProjectContactDetails,
  eventType: EventType,
): ChatIdsResult => {
  // Find project linked to the user by project name
  const project = getProjectByProjectName(projectName, user);

  // If project does not exists return
  if (!project) {
    throw new Error('Project not found');
  }

  if (!hasProjectContactDetails(project)) {
    throw new Error('Contact details not found');
  }

  // Get the contact details of the project
  const contactDetails = project.contactDetails;

  if (!contactDetails) {
    throw new Error('Contact details not found');
  }

  // Get users subscription tier
  const userSubscriptionTier = user.billing?.subscription_tier!;

  // Get max notifications recepients limit according to the subscription limit
  const maxRecepientsLimit = SUBSCRIPTION_LIMITS[userSubscriptionTier].maxRecepients;

  // Build and return the array of chat ids info for each channel
  return [
    buildChatIdsInfo(
      'discord',
      maxRecepientsLimit,
      extractChatIdsFromContactDetails(contactDetails, userSubscriptionTier, eventType).discordChatIds,
    ),
    buildChatIdsInfo(
      'telegram',
      maxRecepientsLimit,
      extractChatIdsFromContactDetails(contactDetails, userSubscriptionTier, eventType).telegramChatIds,
    ),
    buildChatIdsInfo(
      'email',
      maxRecepientsLimit,
      extractChatIdsFromContactDetails(contactDetails, userSubscriptionTier, eventType).emailIds,
    ),
  ];
};

const buildChatIdsInfo = (
  channel: 'discord' | 'telegram' | 'email',
  maxRecepientsLimit: number,
  chatIds?: string[],
): ChatIdsInfo => {
  // Get chat ids
  const ids = chatIds ?? [];

  // Return the chat ids info
  return {
    channel: channel,
    present: ids.length > 0, // Set present according to the length of the chat ids
    chatIds: ids.slice(0, maxRecepientsLimit), // Select recepients according to users subscription limit
  };
};

type ExtractChatIdsResult = { telegramChatIds: string[]; discordChatIds: string[]; emailIds: string[] };

// Extract chat ids from contact details
const extractChatIdsFromContactDetails = (
  contactDetails: ContactDetailsGetPayload<{}>,
  userSubscriptionTier: SubscriptionTier,
  eventType: EventType,
): ExtractChatIdsResult => {
  if (userSubscriptionTier !== 'pro' || (userSubscriptionTier === 'pro' && eventType === 'incident')) {
    return {
      telegramChatIds: contactDetails.telegramChatIds,
      discordChatIds: contactDetails.discordChatIds,
      emailIds: contactDetails.emailIds,
    };
  } else {
    return {
      telegramChatIds: contactDetails.telegramChatIds2,
      discordChatIds: contactDetails.discordChatIds2,
      emailIds: contactDetails.emailIds2,
    };
  }
};
