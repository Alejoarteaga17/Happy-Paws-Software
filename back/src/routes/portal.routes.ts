import { Router } from 'express';
import { getPortalDashboard } from '../controllers/portal.controller';
import { requireAuth, requireOwner } from '../middlewares/auth.middleware';

export const portalRouter = Router();
portalRouter.get('/me', requireAuth, requireOwner, getPortalDashboard);
