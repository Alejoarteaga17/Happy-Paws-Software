import { CorsOptions } from 'cors';

const normalizeOrigin = (origin: string): string => origin.trim().replace(/\/$/, '');

export const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean),
);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
      callback(null, true);
      return;
    }
    callback(new Error('CORS origin not allowed'));
  },
};
