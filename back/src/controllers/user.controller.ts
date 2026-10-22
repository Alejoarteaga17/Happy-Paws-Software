import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';
import { UserService } from '../services/user.service';
import { AppRole } from '../types/auth';

const roles: AppRole[] = ['ADMIN', 'VET', 'RECEPTIONIST', 'OWNER'];

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
