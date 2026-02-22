import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { appWebhook } from './routes/app.webhooks';
import { userRouter } from './routes/user.Route';
// import './services/bullmq/workers/discordNotifications.worker';
// import './services/bullmq/workers/telegramNotifications.worker';
import { discordClient } from './utils/discordBeep.util';
const app: Express = express();

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  console.log('ORIGIN:', req.headers.origin);
  res.setHeader('X-CORS-DEBUG', 'MAIN_APP');
  next();
});

app.use(
  cors({
    origin: ['https://soundtrack-found-aimed-appreciate.trycloudflare.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
