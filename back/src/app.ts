import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppointmentStatus, UserRole, VaccinationStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from './config/prisma';
import { authenticate, authorize } from './middlewares/auth';
import { serialize } from './utils/serialize';

const app = express();
const secret = process.env.JWT_SECRET ?? 'development-secret';
app.use(cors());
app.use(express.json());
app.use((req, res, next) => { res.locals.json = (value: unknown) => res.json(serialize(value)); next(); });
const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ success: true, data: serialize(data), error: null });
const fail = (res: Response, message: string, code = 'BAD_REQUEST', status = 400) => res.status(status).json({ success: false, data: null, error: { code, message } });

app.get('/api/v1/health', (_req, res) => ok(res, { service: 'happy-paws-api', status: 'ok' }));

app.post('/api/v1/auth/login', async (req, res, next) => {
  try {
    const input = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return fail(res, 'Credenciales invalidas.', 'INVALID_CREDENTIALS', 401);
    const token = jwt.sign({ sub: user.id.toString(), role: user.role, email: user.email }, secret, { expiresIn: '8h' });
    await prisma.auditLog.create({ data: { userId: user.id, action: 'LOGIN', entity: 'User' } });
    return ok(res, { token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (error) { next(error); }
});

app.use('/api/v1', authenticate);

app.get('/api/v1/dashboard', async (_req, res, next) => {
  try {
    const [owners, pets, appointments, overdueVaccinations] = await Promise.all([
      prisma.owner.count(), prisma.pet.count(), prisma.appointment.count({ where: { status: AppointmentStatus.SCHEDULED } }),
      prisma.vaccination.count({ where: { OR: [{ status: VaccinationStatus.OVERDUE }, { nextDueDate: { lt: new Date() } }] } })
    ]);
    return ok(res, { owners, pets, upcomingAppointments: appointments, overdueVaccinations });
  } catch (error) { next(error); }
});

app.get('/api/v1/owners', async (req, res, next) => {
  try {
    const query = String(req.query.search ?? '').trim();
    const owners = await prisma.owner.findMany({ where: query ? { OR: [{ fullName: { contains: query, mode: 'insensitive' } }, { phone: { contains: query } }, { email: { contains: query, mode: 'insensitive' } }] } : undefined, include: { pets: true }, take: 50, orderBy: { createdAt: 'desc' } });
    return ok(res, owners);
  } catch (error) { next(error); }
});
app.post('/api/v1/owners', authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), async (req, res, next) => {
  try { const input = z.object({ fullName: z.string().min(2), phone: z.string().min(5), email: z.string().email().optional(), address: z.string().optional() }).parse(req.body); return ok(res, await prisma.owner.create({ data: input }), 201); } catch (error) { next(error); }
});
app.patch('/api/v1/owners/:id', authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), async (req, res, next) => {
  try { const input = z.object({ fullName: z.string().min(2).optional(), phone: z.string().min(5).optional(), email: z.string().email().optional(), address: z.string().optional() }).parse(req.body); return ok(res, await prisma.owner.update({ where: { id: BigInt(String(req.params.id)) }, data: input })); } catch (error) { next(error); }
});
app.delete('/api/v1/owners/:id', authorize(UserRole.ADMIN), async (req, res, next) => { try { await prisma.owner.delete({ where: { id: BigInt(String(req.params.id)) } }); return ok(res, { deleted: true }); } catch (error) { next(error); } });

app.get('/api/v1/pets', async (req, res, next) => {
  try { const query = String(req.query.search ?? '').trim(); const pets = await prisma.pet.findMany({ where: query ? { OR: [{ name: { contains: query, mode: 'insensitive' } }, { petTag: { contains: query, mode: 'insensitive' } }, { owner: { fullName: { contains: query, mode: 'insensitive' } } }, { owner: { phone: { contains: query } } }] } : undefined, include: { owner: true, vaccinations: { orderBy: { nextDueDate: 'asc' } } }, take: 50 }); return ok(res, pets); } catch (error) { next(error); }
});
app.post('/api/v1/pets', authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), async (req, res, next) => { try { const input = z.object({ ownerId: z.coerce.bigint(), petTag: z.string().min(2), name: z.string().min(1), species: z.string().min(1), breed: z.string().optional(), birthDate: z.coerce.date().optional(), weight: z.number().positive().optional() }).parse(req.body); return ok(res, await prisma.pet.create({ data: { ...input, weight: input.weight, ownerId: input.ownerId } }), 201); } catch (error) { next(error); } });
app.patch('/api/v1/pets/:id', authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), async (req, res, next) => { try { const input = z.object({ name: z.string().min(1).optional(), species: z.string().min(1).optional(), breed: z.string().optional(), weight: z.number().positive().optional() }).parse(req.body); return ok(res, await prisma.pet.update({ where: { id: BigInt(String(req.params.id)) }, data: input })); } catch (error) { next(error); } });

app.get('/api/v1/appointments', async (req, res, next) => { try { const where = req.user?.role === UserRole.VET ? { vetId: req.user.id } : undefined; return ok(res, await prisma.appointment.findMany({ where, include: { pet: { include: { owner: true } }, vet: true, services: { include: { service: true } } }, orderBy: { scheduledAt: 'asc' } })); } catch (error) { next(error); } });
app.post('/api/v1/appointments', authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), async (req, res, next) => { try { const input = z.object({ petId: z.coerce.bigint(), vetId: z.coerce.bigint(), scheduledAt: z.coerce.date(), reason: z.string().min(3), serviceIds: z.array(z.coerce.bigint()).default([]) }).parse(req.body); const appointment = await prisma.appointment.create({ data: { petId: input.petId, vetId: input.vetId, scheduledAt: input.scheduledAt, reason: input.reason, services: { create: input.serviceIds.map(serviceId => ({ serviceId })) } }, include: { pet: true } }); return ok(res, appointment, 201); } catch (error) { next(error); } });
app.patch('/api/v1/appointments/:id', authorize(UserRole.ADMIN, UserRole.VET, UserRole.RECEPTIONIST), async (req, res, next) => { try { const input = z.object({ status: z.nativeEnum(AppointmentStatus).optional(), notes: z.string().max(5000).optional(), scheduledAt: z.coerce.date().optional() }).parse(req.body); if (input.notes !== undefined && req.user?.role !== UserRole.VET && req.user?.role !== UserRole.ADMIN) return fail(res, 'Solo un veterinario puede editar notas clinicas.', 'FORBIDDEN', 403); const appointment = await prisma.appointment.update({ where: { id: BigInt(String(req.params.id)) }, data: input }); await prisma.auditLog.create({ data: { userId: req.user?.id, action: 'UPDATE_APPOINTMENT', entity: 'Appointment', entityId: appointment.id } }); return ok(res, appointment); } catch (error) { next(error); } });

app.get('/api/v1/vaccinations', async (req, res, next) => { try { const vaccinations = await prisma.vaccination.findMany({ where: req.user?.role === UserRole.OWNER ? { pet: { owner: { userId: req.user.id } } } : undefined, include: { pet: true }, orderBy: { nextDueDate: 'asc' } }); return ok(res, vaccinations.map(vaccination => ({ ...vaccination, status: vaccination.nextDueDate < new Date() ? VaccinationStatus.OVERDUE : vaccination.status }))); } catch (error) { next(error); } });
app.post('/api/v1/vaccinations', authorize(UserRole.ADMIN, UserRole.VET), async (req, res, next) => { try { const input = z.object({ petId: z.coerce.bigint(), appointmentId: z.coerce.bigint().optional(), vaccineName: z.string().min(2), administeredAt: z.coerce.date(), nextDueDate: z.coerce.date() }).parse(req.body); return ok(res, await prisma.vaccination.create({ data: { ...input, status: input.nextDueDate < new Date() ? VaccinationStatus.OVERDUE : VaccinationStatus.ADMINISTERED } }), 201); } catch (error) { next(error); } });

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => { const message = error instanceof Error ? error.message : 'Error interno del servidor.'; return fail(res, message, 'INTERNAL_ERROR', 500); });
export default app;
