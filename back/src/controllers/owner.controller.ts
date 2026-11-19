import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';
import { OwnerService } from '../services/owner.service';

const fail = (response: Response, error: unknown, fallback: string): void => {
  const code = error instanceof Error ? error.message : fallback;
  const known: Record<string, [number, string]> = {
    OWNER_NOT_FOUND: [404, 'El propietario no existe.'],
    OWNER_ALREADY_LINKED: [409, 'La cuenta ya está vinculada a otro propietario.'],
    OWNER_STATUS_INVALID: [400, 'El estado del propietario es inválido.'],
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
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phoneDigits = phone.replace(/\D/g, '');
  if (!fullName || fullName.length < 3) {
    response.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_OWNER',
        message: 'No se pudo crear el propietario: el nombre debe tener al menos 3 caracteres.',
      },
    });
    return;
  }
  if (!phone || phoneDigits.length < 7 || phoneDigits.length > 15) {
    response.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_OWNER',
        message: 'No se pudo crear el propietario: ingresa un teléfono válido entre 7 y 15 dígitos.',
      },
    });
    return;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    response.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_OWNER',
        message: 'No se pudo crear el propietario: el correo electrónico no tiene un formato válido.',
      },
    });
    return;
  }
  try {
    const data = await OwnerService.create({
      fullName,
      phone,
      email: email || null,
      address: typeof body.address === 'string' ? body.address : null,
    });
    try {
      await AuditService.record({
        actorUserId: request.user!.id,
        action: 'CREATE',
        entityName: 'owners',
        entityId: data.id,
      });
    } catch (auditError) {
      console.error('Owner creation audit log failed:', auditError);
    }
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
  if (typeof body.fullName === 'string' && body.fullName.trim().length > 0 && body.fullName.trim().length < 3) {
    response.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_OWNER',
        message: 'No se pudo actualizar el propietario: el nombre debe tener al menos 3 caracteres.',
      },
    });
    return;
  }
  if (typeof body.phone === 'string') {
    const phoneDigits = body.phone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      response.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'INVALID_OWNER',
          message: 'No se pudo actualizar el propietario: ingresa un teléfono válido entre 7 y 15 dígitos.',
        },
      });
      return;
    }
  }
  if (typeof body.email === 'string' && body.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    response.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_OWNER',
        message: 'No se pudo actualizar el propietario: el correo electrónico no tiene un formato válido.',
      },
    });
    return;
  }
  try {
    const data = await OwnerService.update(id, {
      fullName: typeof body.fullName === 'string' ? body.fullName : undefined,
      phone: typeof body.phone === 'string' ? body.phone : undefined,
      email: body.email === null || typeof body.email === 'string' ? body.email : undefined,
      address: body.address === null || typeof body.address === 'string' ? body.address : undefined,
    });
    try {
      await AuditService.record({
        actorUserId: request.user!.id,
        action: 'UPDATE',
        entityName: 'owners',
        entityId: id,
        metadata: { fields: Object.keys(body) },
      });
    } catch (auditError) {
      console.error('Owner update audit log failed:', auditError);
    }
    response.json({ success: true, data, error: null });
  } catch (error) {
    fail(response, error, 'OWNER_UPDATE_FAILED');
  }
};

export const updateOwnerStatus = async (request: Request, response: Response): Promise<void> => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id) || id < 1 || typeof request.body?.active !== 'boolean') {
    response.status(400).json({
      success: false,
      data: null,
      error: { code: 'OWNER_STATUS_INVALID', message: 'El id o el estado del propietario es inválido.' },
    });
    return;
  }
  try {
    const data = await OwnerService.setActive(id, request.body.active);
    try {
      await AuditService.record({
        actorUserId: request.user!.id,
        action: request.body.active ? 'ACTIVATE' : 'DEACTIVATE',
        entityName: 'owners',
        entityId: id,
      });
    } catch (auditError) {
      console.error('Owner status audit log failed:', auditError);
    }
    response.json({ success: true, data, error: null });
  } catch (error) {
    fail(response, error, 'OWNER_STATUS_UPDATE_FAILED');
  }
};

export const deleteOwner = async (request: Request, response: Response): Promise<void> => {
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
    const data = await OwnerService.delete(id);
    try {
      await AuditService.record({
        actorUserId: request.user!.id,
        action: 'DELETE',
        entityName: 'owners',
        entityId: id,
        metadata: { deletedPets: data.deletedPets },
      });
    } catch (auditError) {
      console.error('Owner deletion audit log failed:', auditError);
    }
    response.json({ success: true, data, error: null });
  } catch (error) {
    fail(response, error, 'OWNER_DELETE_FAILED');
  }
};
