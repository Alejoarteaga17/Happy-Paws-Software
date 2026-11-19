import { Router } from 'express';
import { requireAuth, requireRoles } from '../middlewares/auth.middleware';
import {
  cancelAppointment,
  createAppointment,
  getAppointment,
  listAppointments,
  listAvailableVets,
  updateAppointment,
} from '../controllers/appointment.controller';

export const appointmentRouter = Router();
appointmentRouter.use(requireAuth);
appointmentRouter.get('/vets', requireRoles('ADMIN', 'RECEPTIONIST', 'VET'), listAvailableVets);
appointmentRouter.get('/', requireRoles('ADMIN', 'RECEPTIONIST', 'VET'), listAppointments);
appointmentRouter.get('/:id', requireRoles('ADMIN', 'RECEPTIONIST', 'VET'), getAppointment);
appointmentRouter.post('/', requireRoles('ADMIN', 'RECEPTIONIST'), createAppointment);
appointmentRouter.put('/:id', requireRoles('ADMIN', 'RECEPTIONIST'), updateAppointment);
appointmentRouter.patch('/:id/cancel', requireRoles('ADMIN', 'RECEPTIONIST'), cancelAppointment);
