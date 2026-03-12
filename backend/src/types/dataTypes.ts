import { z } from 'zod';
import { Environment, EventType, IssuePriority, NotificationChannels } from '../../generated/prisma/enums';

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

export const ClientCallType = z.object({
  type: z.enum(EventType),
  projectName: z.string(),
  name: z.string(),
  description: z.string(),
  filePath: z.string().nullable(),
  lineNumber: z.number().nullable(),
  columnNumber: z.number().nullable(),
  environment: z.enum(Environment),
  group: z.string().nullable(),
});

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

export const ProjectNameType = z.object({
  projectName: z.string(),
});

export const ExportLogsType = z.object({
  projectName: z.string(),
  exportType: z.enum(['csv', 'json']),
});

export const AddNotificationChannel = z.object({
  channels: z.array(z.enum(NotificationChannels)).min(1),
});
