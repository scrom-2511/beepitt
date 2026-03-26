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

export const ClientCallType = z.object({
  type: z.enum(['incident', 'issue']),
  projectName: z.string(),
  name: z.string(),
  description: z.string(),
  filePath: z.string().nullable(),
  lineNumber: z.number().nullable(),
  columnNumber: z.number().nullable(),
  environment: z.enum(['production', 'staging', 'development', 'qa', 'uat', 'sandbox']),
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
  issuePriority: z.enum(['unseen', 'critical', 'high', 'low', 'closed']),
});

export const UpdateIncidentSeenType = z.object({
  incidentId: z.number(),
});

export const ProjectNameType = z.object({
  projectName: z.string(),
  projectDesc: z.string(),
});

export const ExportLogsType = z.object({
  exportType: z.enum(['csv', 'json']),
});

export const AddNotificationChannel = z.object({
  channels: z.array(z.enum(['telegram', 'discord', 'slack', 'email'])).min(1),
});

export const UpdateGlobalThrottleWindowType = z.object({
  globalThrottleWindow: z.number(),
});

export const UpdateProThrottleType = z.object({
  eventTriggerCount: z.number(),
  eventTriggerWindow: z.number(),
  globalThrottleWindow: z.number(),
});

export const UpdateRetryConfigType = z.object({
  maxRetries: z.number(),
  retryOffset: z.number(),
});
