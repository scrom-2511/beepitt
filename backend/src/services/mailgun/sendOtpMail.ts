import { mg } from './mailgunClient';

export const sendOTPEmail = async (toEmail: string, otp: number) => {
  try {
    const data = await mg.messages.create('beepitt.scrom.in', {
      from: 'Beepitt <no-reply@beepitt.scrom.in>',
      to: [toEmail],
      subject: 'Your Beepitt Verification Code',
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Your Verification Code</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    console.log('Email sent:', data);

    return otp;
  } catch (error) {
    console.error('Mailgun Error:', error);
    throw error;
  }
};