import { z } from 'zod';
import { IssuePriority, NotificationChannels } from '../../generated/prisma/enums';

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
  'incident',
  'issue',
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
  issuePriority: z.enum(IssuePriority),
});

export const UpdateIncidentSeenType = z.object({
  incidentId: z.number(),
});

export const CreateProjectType = z.object({
  projectName: z.string(),
});

export const AddNotificationChannel = z.object({
  channels: z.array(z.enum(NotificationChannels)).min(1),
});
