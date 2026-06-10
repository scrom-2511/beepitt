export const Environment = ['production', 'staging', 'development', 'qa', 'uat', 'sandbox'] as const;
export type Environment = (typeof Environment)[number];

export const EventType = ['issue', 'incident'] as const;
export type EventType = (typeof EventType)[number];

export const IssuePriority = ['unseen', 'critical', 'high', 'low', 'closed'] as const;
export type IssuePriority = (typeof IssuePriority)[number];

export const NotificationChannels = ['telegram', 'discord', 'slack', 'email'] as const;
export type NotificationChannels = (typeof NotificationChannels)[number];
