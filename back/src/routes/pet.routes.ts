import { Router } from 'express';
import { requireRoles } from '../middlewares/auth.middleware';
import { createPet, listPets } from '../controllers/pet.controller';

export const petRouter = Router();
petRouter.get('/', requireRoles('ADMIN', 'VET', 'RECEPTIONIST'), listPets);
petRouter.post('/', requireRoles('ADMIN','VET', 'RECEPTIONIST'), createPet);