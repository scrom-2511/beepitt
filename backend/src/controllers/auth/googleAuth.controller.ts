import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/prismaClient';
import { HttpStatus } from '../../types/errorCodes';
import { verifyGoogleToken } from '../../utils/verifyGoogleToken.util';

export const googleAuthController = async (req: Request, res: Response) => {
  const { token } = req.body;

  const googleUser = await verifyGoogleToken(token);

  const authAccount = await prisma.authAccount.findUnique({
    where: {
      provider: 'google',
      providerId: googleUser.googleId,
    },
    include: { user: true },
  });

  let user = authAccount?.user;

  if (!user && googleUser.email) {
    user =
      (await prisma.user.findUnique({
        where: { email: googleUser.email },
      })) || undefined;

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
      await prisma.authAccount.create({
        data: {
          provider: 'google',
          providerId: googleUser.googleId,
          userId: user.id,
        },
      });
    }
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: googleUser.email,
        username: googleUser.name,
        authAccounts: {
          create: {
            provider: 'google',
            providerId: googleUser.googleId,
          },
        },
        billing: {
          create: {
            currentStatus: 'active',
            subscription_tier: 'free',
            validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
        password: '',
        emailVerified: true,
        configuration: {
          create: {
            eventsUsed: 0,
            eventTriggerCount: 0,
            eventTriggerWindow: 0,
            globalThrottleWindow: 0,
            maxRetries: 0,
            retryOffset: 0,
            notificationChannels: [],
          },
        },
      },
    });
  }

  const jwtPayload = { id: user.id };
  const jwtSecret = process.env.JWT_SECRET;

  const authToken = jwt.sign(jwtPayload, jwtSecret!, { expiresIn: '30d' });
  console.log(authToken);

  res
    .cookie('authToken', authToken, {
      path: '/',
      httpOnly: true,
    })
    .status(HttpStatus.CREATED)
    .json({ success: true });

  return;
};
