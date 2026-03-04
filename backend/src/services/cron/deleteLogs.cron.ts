import { prisma } from '../../database/prismaClient';

export const deleteServices = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 8);

  await prisma.incident.deleteMany({
    where: {
      user: {
        billing: {
          subscription_tier: 'Free',
        },
      },
      incidentDateAndTime: {
        lte: sevenDaysAgo,
      },
    },
  });

  await prisma.issue.deleteMany({
    where: {
      user: {
        billing: {
          subscription_tier: 'Free',
        },
      },
      issueDateAndTime: {
        lte: sevenDaysAgo,
      },
    },
  });
};