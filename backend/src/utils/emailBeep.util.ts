import { EventType } from '../../generated/prisma/enums';
import { mg } from '../services/mailgun/mailgunClient';

export const emailBeep = async (emails: string[], type: EventType) => {
  try {
    if (!emails.length) return;

    const subject = type === 'issue' ? 'Backend Issue Detected' : 'Backend Incident Detected';
    const text = type === 'issue' ? 'Backend issue detected, please check it.' : 'Backend incident detected, please check it.';
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: ${type === 'issue' ? '#e11d48' : '#f59e0b'};">${subject}</h2>
        <p>${text}</p>
        <hr />
        <p style="font-size: 0.875rem; color: #666;">This is an automated notification from Beepitt.</p>
      </div>
    `;

    // Process email sending based on your mailgun config
    await Promise.allSettled(
      emails.map((email) =>
        mg.messages.create('beepitt.scrom.in', {
          from: 'Beepitt <no-reply@beepitt.scrom.in>',
          to: [email],
          subject,
          text,
          html,
        }),
      ),
    );
  } catch (error) {
    console.error('Email Beep Error:', error);
  }
};
