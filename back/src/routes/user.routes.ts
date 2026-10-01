import { Router } from 'express';
import { getUser, listUsers, updateUserRole } from '../controllers/user.controller';
import { requireAuth, requireRoles } from '../middlewares/auth.middleware';

export const userRouter = Router();
userRouter.use(requireAuth, requireRoles('ADMIN'));
userRouter.get('/', listUsers);
userRouter.get('/:id', getUser);
userRouter.patch('/:id/role', updateUserRole);
