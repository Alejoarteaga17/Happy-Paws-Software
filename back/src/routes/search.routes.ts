import { Router } from 'express';
import { searchRecords } from '../controllers/search.controller';
import { requireAuth, requireRoles } from '../middlewares/auth.middleware';

export const searchRouter = Router();
searchRouter.get('/', requireAuth, requireRoles('ADMIN', 'VET', 'RECEPTIONIST'), searchRecords);
