import { z } from 'zod';

export const LoginType = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const SignupType = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  timezone: z.string(),
});

export const onClientIncidentType = z.object({
  projectName: z.string(),
  incidentName: z.string(),
  incidentDesc: z.string(),
  filePath: z.string().optional(),
});

export const onClientIssueType = z.object({
  projectName: z.string(),
  issueName: z.string(),
  issueDesc: z.string(),
  filePath: z.string(),
});

export enum NotificationType {
  'Incident',
  'Issue',
}

export interface NotificationJob {
  userId: number;
  type: NotificationType;
  data: string[];
}

export const ProfileUpdateType = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export const TimeZoneAndPreferencesUpdateType = z.object({
  city: z.string(),
  timezone: z.string().refine((tz) => {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  }),
});

export const OtpValidateType = z.object({
  otp: z.string(),
});

export const RazorPayCreateOrderType = z.object({
  id: z.string(),
});

export const UpdateIssuePriorityType = z.object({
  issueId: z.number(),
  issuePriority: z.enum(['Unseen', 'Critical', 'High', 'Low', 'Closed']),
});

export const UpdateIncidentSeenType = z.object({
  incidentId: z.number(),
});
