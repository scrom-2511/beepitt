import { SubscriptionTier } from '../generated/prisma/client';

type PlanLimits = {
  maxEvents: number;
  price: number;
  maxProjects: number;
  maxNotificationChannels: number;
  maxRecepients: number;
  maxRecepients2: number;
};

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, PlanLimits> = {
  [SubscriptionTier.free]: {
    maxEvents: 1000,
    price: 0,
    maxProjects: 1,
    maxNotificationChannels: 1,
    maxRecepients: 1,
    maxRecepients2: 0,
  },

  [SubscriptionTier.starter]: {
    maxEvents: 15000,
    price: 15,
    maxProjects: 3,
    maxNotificationChannels: 3,
    maxRecepients: 3,
    maxRecepients2: 0,
  },

  [SubscriptionTier.pro]: {
    maxEvents: 100000,
    price: 29,
    maxProjects: 10,
    maxNotificationChannels: Infinity,
    maxRecepients: 8,
    maxRecepients2: 6,
  },
} as const;
