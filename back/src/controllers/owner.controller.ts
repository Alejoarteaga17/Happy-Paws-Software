import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';
import { OwnerService } from '../services/owner.service';

const fail = (response: Response, error: unknown, fallback: string): void => {
  const code = error instanceof Error ? error.message : fallback;
  const known: Record<string, [number, string]> = {
    OWNER_NOT_FOUND: [404, 'El propietario no existe.'],
    OWNER_ALREADY_LINKED: [409, 'La cuenta ya está vinculada a otro propietario.'],
  };
  const [status, message] = known[code] ?? [500, 'No se pudo completar la operación.'];
  response.status(status).json({ success: false, data: null, error: { code: known[code] ? code : fallback, message } });
};

export const listOwners = async (_request: Request, response: Response): Promise<void> => {
  try {
    response.json({ success: true, data: await OwnerService.list(), error: null });
  } catch (error) {
    fail(response, error, 'OWNERS_LIST_FAILED');
  }
};

export const getOwner = async (request: Request, response: Response): Promise<void> => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id) || id < 1) {
    response.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_OWNER_ID', message: 'El id del propietario es inválido.' },
    });
    return;
  }
  try {
    response.json({ success: true, data: await OwnerService.getById(id), error: null });
  } catch (error) {
    fail(response, error, 'OWNER_LOOKUP_FAILED');
  }
};

export const createOwner = async (request: Request, response: Response): Promise<void> => {
  const body = request.body as Record<string, unknown>;
  if (
    typeof body.fullName !== 'string' ||
    !body.fullName.trim() ||
    typeof body.phone !== 'string' ||
    !body.phone.trim()
  ) {
    response.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_OWNER', message: 'Nombre y teléfono son obligatorios.' },
    });
    return;
  }
  try {
    const data = await OwnerService.create({
      fullName: body.fullName,
      phone: body.phone,
      email: typeof body.email === 'string' ? body.email : null,
      address: typeof body.address === 'string' ? body.address : null,
      authUserId: typeof body.authUserId === 'string' ? body.authUserId : null,
    });
    await AuditService.record({
      actorUserId: request.user!.id,
      action: 'CREATE',
      entityName: 'owners',
      entityId: data.id,
    });
    response.status(201).json({ success: true, data, error: null });
  } catch (error) {
    fail(response, error, 'OWNER_CREATE_FAILED');
  }
};

export const updateOwner = async (request: Request, response: Response): Promise<void> => {
  const id = Number(request.params.id);
  const body = request.body as Record<string, unknown>;
  if (!Number.isInteger(id) || id < 1 || Object.keys(body).length === 0) {
    response.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_OWNER', message: 'Datos de propietario inválidos.' },
    });
    return;
  }
  try {
    const data = await OwnerService.update(id, {
      fullName: typeof body.fullName === 'string' ? body.fullName : undefined,
      phone: typeof body.phone === 'string' ? body.phone : undefined,
      email: body.email === null || typeof body.email === 'string' ? body.email : undefined,
      address: body.address === null || typeof body.address === 'string' ? body.address : undefined,
      authUserId: body.authUserId === null || typeof body.authUserId === 'string' ? body.authUserId : undefined,
    });
    await AuditService.record({
      actorUserId: request.user!.id,
      action: 'UPDATE',
      entityName: 'owners',
      entityId: id,
      metadata: { fields: Object.keys(body) },
    });
    response.json({ success: true, data, error: null });
  } catch (error) {
    fail(response, error, 'OWNER_UPDATE_FAILED');
  }
};
