export type NotificationChannels = 'telegram' | 'discord' | 'email';

export enum CurrentStatus {
  'active',
  'inactive',
}

export type SubscriptionTier = 'free' | 'starter' | 'pro';