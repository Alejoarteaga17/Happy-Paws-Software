import { Router } from 'express';
import { listAuditLogs } from '../controllers/audit.controller';
import { requireAuth, requireRoles } from '../middlewares/auth.middleware';

export const auditRouter = Router();
auditRouter.get('/', requireAuth, requireRoles('ADMIN'), listAuditLogs);
