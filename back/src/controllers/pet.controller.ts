import { Request, Response } from 'express';
import { PetService } from '../services/pet.service';
import { CreatePetInput } from '../types/pet';

const sendError = (response: Response, error: unknown, fallbackCode: string): void => {
  const code = error instanceof Error ? error.message : fallbackCode;
  const errors: Record<string, { status: number; message: string }> = {
    OWNER_NOT_FOUND: { status: 400, message: 'El propietario indicado no existe.' },
    PET_TAG_ALREADY_EXISTS: { status: 409, message: 'El pet_tag ya está registrado.' }
  };
  const mappedError = errors[code];
  response.status(mappedError?.status ?? 500).json({
    success: false,
    data: null,
    error: { code: mappedError ? code : fallbackCode, message: mappedError?.message ?? 'No se pudo completar la operación. Intenta nuevamente.' }
  });
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
  const validCreate = typeof body.ownerId === 'number' && Number.isInteger(body.ownerId) && body.ownerId > 0 &&
    typeof body.petTag === 'string' && body.petTag.trim().length > 0 &&
    typeof body.name === 'string' && body.name.trim().length > 0 &&
    typeof body.species === 'string' && body.species.trim().length > 0 &&
    (body.breed === undefined || typeof body.breed === 'string') &&
    (body.birthDate === undefined || (typeof body.birthDate === 'string' && !Number.isNaN(Date.parse(body.birthDate)))) &&
    (body.weight === undefined || (typeof body.weight === 'number' && body.weight > 0));

  if (!validCreate) {
    response.status(400).json({ success: false, data: null, error: { code: 'INVALID_PET', message: 'Completa los datos de la mascota con valores válidos.' } });
    return;
  }

  try {
    response.status(201).json({ success: true, data: await PetService.create(body as unknown as CreatePetInput), error: null });
  } catch (error) {
    sendError(response, error, 'PET_CREATE_FAILED');
  }
};