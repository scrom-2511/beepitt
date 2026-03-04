import { prisma } from '../../database/prismaClient';
import { getUserBillingInfo, setUserBillingInfo } from '../../services/redis/billingTempStorage.redis';

export const billingChecker = async (userId: number) => {
  // Check users subscription tier from redis
  const billingInfo = await getUserBillingInfo(userId);

  // If it exists in redis db, return
  if (billingInfo) {
    return;
  }
  
  await prisma.$transaction(async (tx) => {
    // Get the user
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: { billing: true },
    });

    // If user does not exist throw error
    if (!user) {
      throw new Error('User not found');
    }

    // If no billing exists, create Free billing
    if (!user.billing) {
      // Get current date
      const validTill = new Date();
      validTill.setUTCDate(validTill.getUTCDate() + 30);

      // Create the billing row
      await tx.billing.create({
        data: {
          userId: user.id,
          subscription_tier: 'Free',
          currentStatus: 'Active',
          validTill: validTill,
        },
      });

      return;
    }

    // Get current date
    const now = new Date();

    // If current date >= user's valid till date, update user to Free mode
    if (now >= user.billing.validTill) {
      const validTill = new Date();
      validTill.setUTCDate(validTill.getUTCDate() + 30);

      await tx.user.update({
        where: { id: user.id },
        data: {
          eventsUsed: 0,
          billing: {
            update: {
              subscription_tier: 'Free',
              validTill: validTill,
            },
          },
        },
      });
    }

    // Set the data in redis db
    await setUserBillingInfo(userId, user.billing.subscription_tier);
  });
};
