import { Request, Response } from "express";
import { bot } from "../utils/telegramBeep.utils";

export const telegramBotWebhook = async (req: Request, res: Response) => {
  bot.processUpdate(req.body);

  res.sendStatus(200);
};
