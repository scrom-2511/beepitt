import { Router } from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import { onClientIncidentWebhook } from '../webhooks/onClientIncident.webhook';
import { razorPayWebhook } from '../webhooks/razorpay.webhook';
import { telegramBotWebhook } from '../webhooks/telegramBot.webhook';

export const appWebhook = Router();

appWebhook.post('/telegramBot', telegramBotWebhook);
appWebhook.post('/onClientIncident', isLoggedIn, onClientIncidentWebhook);
appWebhook.post('/razorpayUpdate', razorPayWebhook);
