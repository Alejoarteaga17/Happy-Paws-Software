import { Router } from 'express';
import { createVaccination, listVaccinations } from '../controllers/vaccination.controller';
import { requireAuth, requireRoles } from '../middlewares/auth.middleware';

export const vaccinationRouter = Router();
vaccinationRouter.use(requireAuth);
vaccinationRouter.get('/', requireRoles('ADMIN', 'VET', 'RECEPTIONIST'), listVaccinations);
vaccinationRouter.post('/', requireRoles('ADMIN', 'VET'), createVaccination);
