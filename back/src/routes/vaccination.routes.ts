import { Router } from 'express';
import { createVaccination, listVaccinations } from '../controllers/vaccination.controller';
import { requireAuth } from '../middlewares/auth.middleware';

export const vaccinationRouter = Router();
vaccinationRouter.use(requireAuth);
vaccinationRouter.get('/', listVaccinations);
vaccinationRouter.post('/', createVaccination);