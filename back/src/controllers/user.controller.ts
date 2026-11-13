import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';
import { UserService } from '../services/user.service';
import { AppRole } from '../types/auth';

const roles: AppRole[] = ['ADMIN', 'VET', 'RECEPTIONIST', 'OWNER'];

export const createUser = async (request: Request, response: Response): Promise<void> => {
  const { email, password, fullName, role, ownerId } = request.body ?? {};
  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof fullName !== 'string' ||
    typeof role !== 'string' ||
    !roles.includes(role as AppRole) ||
    (role === 'OWNER' && !Number.isInteger(ownerId))
  ) {
    response.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_USER', message: 'Los datos de la cuenta no son válidos.' },
    });
    return;
  }
  try {
    const data = await UserService.create({ email, password, fullName, role: role as AppRole, ownerId });
    await AuditService.record({
      actorUserId: request.user!.id,
      action: 'CREATE_USER',
      entityName: 'profiles',
      entityId: data.id,
      metadata: { role },
    });
    response.status(201).json({ success: true, data, error: null });
  } catch (error) {
    const code = error instanceof Error ? error.message.split(':')[0] : 'USER_CREATE_FAILED';
    const status = code === 'OWNER_NOT_FOUND_OR_ALREADY_LINKED' || code === 'OWNER_ID_REQUIRED' ? 400 : 500;
    response.status(status).json({
      success: false,
      data: null,
      error: { code, message: 'No se pudo crear la cuenta.' },
    });
  }
};

export const listUsers = async (_request: Request, response: Response): Promise<void> => {
  try {
    response.json({ success: true, data: await UserService.list(), error: null });
  } catch {
    response.status(500).json({
      success: false,
      data: null,
      error: { code: 'USERS_LIST_FAILED', message: 'No se pudieron cargar los usuarios.' },
    });
  }
};

export const getUser = async (request: Request, response: Response): Promise<void> => {
  const id = typeof request.params.id === 'string' ? request.params.id : request.params.id[0];
  try {
    response.json({ success: true, data: await UserService.getById(id), error: null });
  } catch (error) {
    response.status(error instanceof Error && error.message === 'USER_NOT_FOUND' ? 404 : 500).json({
      success: false,
      data: null,
      error: {
        code: error instanceof Error ? error.message : 'USER_LOOKUP_FAILED',
        message: 'No se pudo cargar el usuario.',
      },
    });
  }
};

export const updateUserRole = async (request: Request, response: Response): Promise<void> => {
  const id = typeof request.params.id === 'string' ? request.params.id : request.params.id[0];
  const role = request.body?.role;
  if (typeof role !== 'string' || !roles.includes(role as AppRole)) {
    response
      .status(400)
      .json({ success: false, data: null, error: { code: 'INVALID_ROLE', message: 'El rol indicado no es válido.' } });
    return;
  }
  try {
    const data = await UserService.updateRole(id, role as AppRole);
    await AuditService.record({
      actorUserId: request.user!.id,
      action: 'UPDATE_ROLE',
      entityName: 'profiles',
      entityId: id,
      metadata: { role },
    });
    response.json({ success: true, data, error: null });
  } catch {
    response.status(500).json({
      success: false,
      data: null,
      error: { code: 'USER_ROLE_UPDATE_FAILED', message: 'No se pudo actualizar el rol.' },
    });
  }
};

export const updateUserStatus = async (request: Request, response: Response): Promise<void> => {
  const id = typeof request.params.id === 'string' ? request.params.id : request.params.id[0];
  if (typeof request.body?.active !== 'boolean') {
    response.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_USER_STATUS', message: 'El estado activo debe ser booleano.' },
    });
    return;
  }
  try {
    const data = await UserService.updateStatus(id, request.body.active);
    await AuditService.record({
      actorUserId: request.user!.id,
      action: request.body.active ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      entityName: 'profiles',
      entityId: id,
      metadata: { active: request.body.active },
    });
    response.json({ success: true, data, error: null });
  } catch {
    response.status(500).json({
      success: false,
      data: null,
      error: { code: 'USER_STATUS_UPDATE_FAILED', message: 'No se pudo actualizar el estado.' },
    });
  }
};
