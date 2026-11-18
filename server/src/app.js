import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';
import accountRoutes from './routes/account.routes.js';
import botsRoutes from './routes/bots.routes.js';
import deployRoutes from './routes/deploy.routes.js';
import healthRoutes from './routes/health.routes.js';

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/api/health', healthRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/bots', botsRoutes);
app.use('/api/deploy', deployRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;

