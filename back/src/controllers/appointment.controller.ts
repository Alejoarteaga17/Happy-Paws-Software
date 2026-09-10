import { Request, Response } from 'express';
import { AppointmentStatus, CreateAppointmentInput, UpdateAppointmentInput } from '../types/appointment';
import { AppointmentService } from '../services/appointment.service';

const statuses: AppointmentStatus[] = ['SCHEDULED', 'COMPLETED', 'CANCELLED'];

const sendError = (response: Response, error: unknown, fallbackCode: string): void => {
  const message = error instanceof Error ? error.message : 'Error interno';
  const notFound = message === 'APPOINTMENT_NOT_FOUND';
  response.status(notFound ? 404 : 500).json({ success: false, data: null, error: { code: notFound ? 'APPOINTMENT_NOT_FOUND' : fallbackCode, message: notFound ? 'La cita no existe' : message } });
};

export const listAppointments = async (_request: Request, response: Response): Promise<void> => {
  try { response.json({ success: true, data: await AppointmentService.list(), error: null }); }
  catch (error) { sendError(response, error, 'APPOINTMENTS_LIST_FAILED'); }
};

export const getAppointment = async (request: Request, response: Response): Promise<void> => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id)) { response.status(400).json({ success: false, data: null, error: { code: 'INVALID_APPOINTMENT_ID', message: 'El id de la cita es inválido' } }); return; }
  try { response.json({ success: true, data: await AppointmentService.getById(id), error: null }); }
  catch (error) { sendError(response, error, 'APPOINTMENT_LOOKUP_FAILED'); }
};

export const createAppointment = async (request: Request, response: Response): Promise<void> => {
  const body = request.body as Record<string, unknown>;
  const validCreate = typeof body.petId === 'number' && Number.isInteger(body.petId) &&
    typeof body.scheduledAt === 'string' && !Number.isNaN(Date.parse(body.scheduledAt)) &&
    typeof body.reason === 'string' && body.reason.trim().length > 0 &&
    (body.vetId === undefined || typeof body.vetId === 'string');
  if (!validCreate) { response.status(400).json({ success: false, data: null, error: { code: 'INVALID_APPOINTMENT', message: 'Datos de cita inválidos' } }); return; }
  try { response.status(201).json({ success: true, data: await AppointmentService.create(body as CreateAppointmentInput), error: null }); }
  catch (error) { sendError(response, error, 'APPOINTMENT_CREATE_FAILED'); }
};

export const updateAppointment = async (request: Request, response: Response): Promise<void> => {
  const id = Number(request.params.id);
  const body = request.body as Record<string, unknown>;
  const validUpdate = Object.keys(body).length > 0 &&
    (body.petId === undefined || (typeof body.petId === 'number' && Number.isInteger(body.petId))) &&
    (body.scheduledAt === undefined || (typeof body.scheduledAt === 'string' && !Number.isNaN(Date.parse(body.scheduledAt)))) &&
    (body.reason === undefined || (typeof body.reason === 'string' && body.reason.trim().length > 0)) &&
    (body.vetId === undefined || body.vetId === null || typeof body.vetId === 'string') &&
    (body.status === undefined || (typeof body.status === 'string' && statuses.includes(body.status as AppointmentStatus)));
  if (!Number.isInteger(id) || !validUpdate) { response.status(400).json({ success: false, data: null, error: { code: 'INVALID_APPOINTMENT', message: 'Datos de cita inválidos' } }); return; }
  try { response.json({ success: true, data: await AppointmentService.update(id, body as UpdateAppointmentInput), error: null }); }
  catch (error) { sendError(response, error, 'APPOINTMENT_UPDATE_FAILED'); }
};

export const cancelAppointment = async (request: Request, response: Response): Promise<void> => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id)) { response.status(400).json({ success: false, data: null, error: { code: 'INVALID_APPOINTMENT_ID', message: 'El id de la cita es inválido' } }); return; }
  try { response.json({ success: true, data: await AppointmentService.cancel(id), error: null }); }
  catch (error) { sendError(response, error, 'APPOINTMENT_CANCEL_FAILED'); }
};