import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { cancelAppointment, createAppointment, getAppointment, listAppointments, updateAppointment } from '../controllers/appointment.controller';

export const appointmentRouter = Router();
appointmentRouter.get('/', requireAuth, listAppointments);
appointmentRouter.get('/:id', requireAuth, getAppointment);
appointmentRouter.post('/', requireAuth, createAppointment);
appointmentRouter.put('/:id', requireAuth, updateAppointment);
appointmentRouter.patch('/:id/cancel', requireAuth, cancelAppointment);