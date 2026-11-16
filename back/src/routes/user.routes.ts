import { Router } from 'express';
import { createUser, getUser, listUsers, updateUserRole, updateUserStatus } from '../controllers/user.controller';
import { requireAuth, requireRoles } from '../middlewares/auth.middleware';

export const userRouter = Router();
userRouter.use(requireAuth, requireRoles('ADMIN', 'RECEPTIONIST'));
userRouter.get('/', listUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', createUser);
userRouter.patch('/:id/role', requireRoles('ADMIN'), updateUserRole);
userRouter.patch('/:id/status', requireRoles('ADMIN'), updateUserStatus);
