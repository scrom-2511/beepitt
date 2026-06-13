import { Request, Response } from 'express';
import { bot } from '../utils/telegramBeep.utils';

export const telegramBotWebhook = async (req: Request, res: Response) => {
  const secretToken = req.headers['x-telegram-bot-api-secret-token'];

  if (secretToken !== 'somethiadf') {
    console.warn('Unauthorized webhook request received');
    return res.sendStatus(403);
  }

  bot.processUpdate(req.body);

  res.sendStatus(200);
};
