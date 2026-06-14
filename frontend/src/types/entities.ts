import { Environment, IssuePriority } from './enums';

export interface BaseEntity {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  projectName: string;
  environment: Environment;
  occurrences: number;
  filePath: string | null;
  lineNumber: number | null;
  columnNumber: number | null;
  group: string | null;
  priority?: IssuePriority | null;
  seenAt?: string | null;
  resolvedAt?: string | null;
}
