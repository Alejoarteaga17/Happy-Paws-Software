import { Router } from 'express';
import { requireAuth, requireRoles } from '../middlewares/auth.middleware';
import { createPet, deletePet, listPets, updatePet } from '../controllers/pet.controller';

export const petRouter = Router();
petRouter.use(requireAuth);
petRouter.get('/', requireRoles('ADMIN', 'VET', 'RECEPTIONIST'), listPets);
petRouter.post('/', requireRoles('ADMIN', 'RECEPTIONIST'), createPet);
petRouter.put('/:id', requireRoles('ADMIN', 'RECEPTIONIST', 'VET'), updatePet);
petRouter.delete('/:id', requireRoles('ADMIN'), deletePet);
