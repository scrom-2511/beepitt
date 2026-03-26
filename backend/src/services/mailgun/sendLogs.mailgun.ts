import AdmZip from 'adm-zip';
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
    // Zip the file
    const zip = new AdmZip();
    const extension = exportType === 'csv' ? 'csv' : 'json';

    zip.addFile(`incident-logs.${extension}`, Buffer.from(incidentsData, 'utf8'));
    zip.addFile(`issue-logs.${extension}`, Buffer.from(issuesData, 'utf8'));

    const zipBuffer = zip.toBuffer();

    const data = await mg.messages.create('beepitt.scrom.in', {
      from: 'Beepitt <no-reply@beepitt.scrom.in>',
      to: [toEmail],
      subject: 'Your Incident and Issue Logs Export (Compressed)',
      text: `Your exported incident and issue logs are attached as a compressed zip file.`,
      attachment: [
        {
          filename: 'logs.zip',
          data: zipBuffer,
          contentType: 'application/zip',
        },
      ],
    });

    console.log('Email sent:', data);
  } catch (error) {
    console.error('Mailgun Error:', error);
    throw error;
  }
};
