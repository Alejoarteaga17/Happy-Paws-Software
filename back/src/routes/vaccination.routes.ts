import { Router } from 'express';
import { createVaccination, listVaccinations } from '../controllers/vaccination.controller';
import { allowAnonymousRead, requireAuth } from '../middlewares/auth.middleware';

export const vaccinationRouter = Router();
vaccinationRouter.get('/', allowAnonymousRead, listVaccinations);
vaccinationRouter.post('/', requireAuth, createVaccination);