import { Router } from 'express';
import { createOwner, getOwner, listOwners, updateOwner } from '../controllers/owner.controller';
import { requireAuth, requireRoles } from '../middlewares/auth.middleware';

export const ownerRouter = Router();
ownerRouter.use(requireAuth, requireRoles('ADMIN', 'RECEPTIONIST', 'VET'));
ownerRouter.get('/', listOwners);
ownerRouter.get('/:id', getOwner);
ownerRouter.post('/', requireRoles('ADMIN', 'RECEPTIONIST'), createOwner);
ownerRouter.put('/:id', requireRoles('ADMIN', 'RECEPTIONIST'), updateOwner);
