import { Router } from 'express';
import { auditLogin, getCurrentUser } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

export const authRouter = Router();
authRouter.get('/me', requireAuth, getCurrentUser);
authRouter.post('/audit-login', requireAuth, auditLogin);
