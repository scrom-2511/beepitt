import z from 'zod';
import { ExportLogsType } from '../../types/dataTypes';
import { mg } from './mailgunClient';

export const sendLogs = async (
  incidentsData: string,
  issuesData: string,
  toEmail: string,
  exportType: z.infer<typeof ExportLogsType>['exportType'],
) => {
  try {
    const data = await mg.messages.create('beepitt.scrom.in', {
      from: 'Beepitt <no-reply@beepitt.scrom.in>',
      to: [toEmail],
      subject: 'Your Incident and Issue Logs Export',
      text: `Attached is your exported incident and issue logs JSON file`,
      attachment: [
        {
          filename: exportType === 'csv' ? 'incident-logs.csv' : 'incident-logs.json',
          data: incidentsData,
          contentType: exportType === 'csv' ? 'text/csv' : 'application/json',
        },
        {
          filename: exportType === 'csv' ? 'issue-logs.csv' : 'issue-logs.json',
          data: issuesData,
          contentType: exportType === 'csv' ? 'text/csv' : 'application/json',
        },
      ],
    });

    console.log('Email sent:', data);
  } catch (error) {
    console.error('Mailgun Error:', error);
    throw error;
  }
};
