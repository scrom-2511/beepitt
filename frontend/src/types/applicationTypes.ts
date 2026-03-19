export type NotificationChannels = 'telegram' | 'discord' | 'slack' | 'email';

export enum CurrentStatus {
  'active',
  'inactive',
}

export type SubscriptionTier = 'free' | 'starter' | 'pro';