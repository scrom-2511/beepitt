import crypto from 'crypto';
import z from 'zod';
import { ClientCallType } from '../../types/dataTypes';

export const generateHashKey = (eventData: z.infer<typeof ClientCallType>) => {
  const { projectName, type, name, filePath, lineNumber, columnNumber } = eventData;
  return crypto
    .createHash('sha256')
    .update(`${projectName}:${type}:${name}:${filePath}:${lineNumber}:${columnNumber}`)
    .digest('hex');
};
