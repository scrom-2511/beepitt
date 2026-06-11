import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { appWebhook } from './routes/app.webhooks';
import { userRouter } from './routes/user.Route';
// import './services/bullmq/workers/discordNotifications.worker';
// import './services/bullmq/workers/telegramNotifications.worker';
import { FRONTEND_URL } from '../config/app.config';
import { discordClient } from './utils/discordBeep.util';
const app: Express = express();

app.use(cookieParser());
app.use(express.json());

// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin}`);
//   if (req.headers['access-control-request-private-network']) {
//     res.setHeader('Access-Control-Allow-Private-Network', 'true');
//   }
//   next();
// });

app.use(
  cors({
    origin: ['https://recipe-fda-stood-rebates.trycloudflare.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  }),
);

discordClient.once('clientReady', () => {
  console.log(`Discord bot logged in as ${discordClient.user?.tag}`);
});

app.use('/user', userRouter);
app.use('/app/webhook', appWebhook);

app.listen(3000, '0.0.0.0', () => {
  console.log('WSL server listening');
});
