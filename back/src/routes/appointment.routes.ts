import { Router } from 'express';
import { requireAuth, requireRoles } from '../middlewares/auth.middleware';
import {
  cancelAppointment,
  createAppointment,
  getAppointment,
  listAppointments,
  updateAppointment,
} from '../controllers/appointment.controller';

export const appointmentRouter = Router();
appointmentRouter.use(requireAuth);
appointmentRouter.get('/', requireRoles('ADMIN', 'VET', 'RECEPTIONIST'), listAppointments);
appointmentRouter.get('/:id', requireRoles('ADMIN', 'VET', 'RECEPTIONIST'), getAppointment);
appointmentRouter.post('/', requireRoles('ADMIN', 'VET', 'RECEPTIONIST'), createAppointment);
appointmentRouter.put('/:id', requireRoles('ADMIN', 'VET', 'RECEPTIONIST'), updateAppointment);
appointmentRouter.patch('/:id/cancel', requireRoles('ADMIN', 'VET', 'RECEPTIONIST'), cancelAppointment);
