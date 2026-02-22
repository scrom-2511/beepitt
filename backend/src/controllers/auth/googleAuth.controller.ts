import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../database/prismaClient';
import { HttpStatus } from '../../types/errorCodes';
import { verifyGoogleToken } from '../../utils/verifyGoogleToken.util';

export const googleAuthController = async (req: Request, res: Response) => {
  const { token } = req.body;

  const googleUser = await verifyGoogleToken(token);

  const authAccount = await prisma.authAccount.findUnique({
    where: {
      provider: 'GOOGLE',
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
      await prisma.authAccount.create({
        data: {
          provider: 'GOOGLE',
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
            provider: 'GOOGLE',
            providerId: googleUser.googleId,
          },
        },
        identifierKey: uuidv4(),
        billing: {
          create: {
            currentStatus: 'Active',
            subscription_tier: 'Free',
            validTill: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          },
        },
        password: '',
        emailVerified: true
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
