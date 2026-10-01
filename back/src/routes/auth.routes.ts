import { Router } from 'express';
import { getCurrentUser } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

export const authRouter = Router();
authRouter.get('/me', requireAuth, getCurrentUser);
