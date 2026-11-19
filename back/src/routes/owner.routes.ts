import { Router } from 'express';
import {
  createOwner,
  deleteOwner,
  getOwner,
  listOwners,
  updateOwner,
  updateOwnerStatus,
} from '../controllers/owner.controller';
import { requireAuth, requireRoles } from '../middlewares/auth.middleware';

export const ownerRouter = Router();
ownerRouter.use(requireAuth);
ownerRouter.get('/', requireRoles('ADMIN', 'RECEPTIONIST'), listOwners);
ownerRouter.get('/:id', requireRoles('ADMIN', 'RECEPTIONIST'), getOwner);
ownerRouter.post('/', requireRoles('ADMIN', 'RECEPTIONIST'), createOwner);
ownerRouter.put('/:id', requireRoles('ADMIN', 'RECEPTIONIST'), updateOwner);
ownerRouter.patch('/:id/status', requireRoles('ADMIN'), updateOwnerStatus);
ownerRouter.delete('/:id', requireRoles('ADMIN', 'RECEPTIONIST'), deleteOwner);
