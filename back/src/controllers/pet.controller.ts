import { Request, Response } from 'express';
import { PetService } from '../services/pet.service';
import { CreatePetInput, UpdatePetInput } from '../types/pet';
import { AuditService } from '../services/audit.service';

const sendError = (response: Response, error: unknown, fallbackCode: string): void => {
  const code = error instanceof Error ? error.message : fallbackCode;
  const errors: Record<string, { status: number; message: string }> = {
    OWNER_NOT_FOUND: { status: 400, message: 'El propietario indicado no existe.' },
    PET_TAG_ALREADY_EXISTS: { status: 409, message: 'El pet_tag ya está registrado.' },
    PET_NOT_FOUND: { status: 404, message: 'La mascota no existe.' },
  };

  const mappedError = errors[code];
  response.status(mappedError?.status ?? 500).json({
    success: false,
    data: null,
    error: {
      code: mappedError ? code : fallbackCode,
      message: mappedError?.message ?? 'No se pudo completar la operación. Intenta nuevamente.',
    },
  });
};

const parsePetId = (request: Request, response: Response): number | null => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id) || id < 1) {
    response.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_PET_ID', message: 'El id de la mascota es inválido.' },
    });
    return null;
  }
  return id;
};

export const listPets = async (_request: Request, response: Response): Promise<void> => {
  try {
    response.json({ success: true, data: await PetService.list(), error: null });
  } catch (error) {
    sendError(response, error, 'PETS_LIST_FAILED');
  }
};

export const createPet = async (request: Request, response: Response): Promise<void> => {
  const body = request.body as Record<string, unknown>;
  const validCreate =
    typeof body.ownerId === 'number' &&
    Number.isInteger(body.ownerId) &&
    body.ownerId > 0 &&
    typeof body.petTag === 'string' &&
    body.petTag.trim().length > 0 &&
    typeof body.name === 'string' &&
    body.name.trim().length > 0 &&
    typeof body.species === 'string' &&
    body.species.trim().length > 0 &&
    (body.breed === undefined || typeof body.breed === 'string') &&
    (body.birthDate === undefined ||
      (typeof body.birthDate === 'string' && !Number.isNaN(Date.parse(body.birthDate)))) &&
    (body.weight === undefined || (typeof body.weight === 'number' && body.weight > 0));

  if (!validCreate) {
    response.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_PET', message: 'Completa los datos de la mascota con valores válidos.' },
    });
    return;
  }

  try {
    const data = await PetService.create(body as unknown as CreatePetInput);
    await AuditService.record({
      actorUserId: request.user!.id,
      action: 'CREATE',
      entityName: 'pets',
      entityId: data.id,
    });
    response.status(201).json({ success: true, data, error: null });
  } catch (error) {
    sendError(response, error, 'PET_CREATE_FAILED');
  }
};

export const updatePet = async (request: Request, response: Response): Promise<void> => {
  const id = parsePetId(request, response);
  const body = request.body as Record<string, unknown>;
  const valid =
    id !== null &&
    Object.keys(body).length > 0 &&
    (body.ownerId === undefined ||
      (typeof body.ownerId === 'number' && Number.isInteger(body.ownerId) && body.ownerId > 0)) &&
    (body.petTag === undefined || (typeof body.petTag === 'string' && body.petTag.trim().length > 0)) &&
    (body.name === undefined || (typeof body.name === 'string' && body.name.trim().length > 0)) &&
    (body.species === undefined || (typeof body.species === 'string' && body.species.trim().length > 0)) &&
    (body.breed === undefined || body.breed === null || typeof body.breed === 'string') &&
    (body.birthDate === undefined ||
      body.birthDate === null ||
      (typeof body.birthDate === 'string' && !Number.isNaN(Date.parse(body.birthDate)))) &&
    (body.weight === undefined || body.weight === null || (typeof body.weight === 'number' && body.weight > 0));
  if (!valid) {
    response.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_PET', message: 'Completa los datos de la mascota con valores válidos.' },
    });
    return;
  }
  try {
    const data = await PetService.update(id as number, body as unknown as UpdatePetInput);
    await AuditService.record({
      actorUserId: request.user!.id,
      action: 'UPDATE',
      entityName: 'pets',
      entityId: id as number,
    });
    response.json({ success: true, data, error: null });
  } catch (error) {
    sendError(response, error, 'PET_UPDATE_FAILED');
  }
};

export const deletePet = async (request: Request, response: Response): Promise<void> => {
  const id = parsePetId(request, response);
  if (id === null) return;
  try {
    const data = await PetService.setDeleted(id, true);
    await AuditService.record({ actorUserId: request.user!.id, action: 'DELETE', entityName: 'pets', entityId: id });
    response.json({ success: true, data, error: null });
  } catch (error) {
    sendError(response, error, 'PET_DELETE_FAILED');
  }
};
