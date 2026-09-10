import { Request, Response } from 'express';
import { VaccinationService } from '../services/vaccination.service';
import { VaccinationStatus } from '../types/vaccination';

export const listVaccinations = async (_request: Request, response: Response): Promise<void> => {
  try {
    const data = await VaccinationService.list();
    response.json({ success: true, data, error: null });
  } catch (error) {
    response.status(500).json({
      success: false,
      data: null,
      error: { code: 'VACCINATIONS_LIST_FAILED', message: error instanceof Error ? error.message : 'Error interno' }
    });
  }
};

export const createVaccination = async (request: Request, response: Response): Promise<void> => {
  const { petId: rawPetId, vaccineName, administeredAt, nextDueDate, status: rawStatus } = request.body as Record<string, unknown>;
  const petId = typeof rawPetId === 'number' ? rawPetId : NaN;
  const statuses: VaccinationStatus[] = ['ADMINISTERED', 'PENDING', 'OVERDUE'];
  const status = typeof rawStatus === 'string' && statuses.includes(rawStatus as VaccinationStatus) ? rawStatus as VaccinationStatus : null;
  if (!Number.isInteger(petId) || petId < 1 || typeof vaccineName !== 'string' || !vaccineName.trim() || typeof administeredAt !== 'string' || typeof nextDueDate !== 'string' || !administeredAt || !nextDueDate || status === null) {
    response.status(400).json({ success: false, data: null, error: { code: 'INVALID_VACCINATION', message: 'Datos de vacunación inválidos' } });
    return;
  }

  try {
    const data = await VaccinationService.create({ petId, vaccineName, administeredAt, nextDueDate, status });
    response.status(201).json({ success: true, data, error: null });
  } catch (error) {
    const errorCode = error instanceof Error ? error.message : 'VACCINATION_CREATE_FAILED';
    const knownErrors: Record<string, { status: number; message: string }> = {
      PET_NOT_FOUND: { status: 404, message: 'La mascota indicada no existe. Verifica el ID antes de guardar la vacunación.' },
      PET_LOOKUP_FAILED: { status: 500, message: 'No se pudo comprobar la mascota. Intenta nuevamente.' },
      VACCINATION_CREATE_FAILED: { status: 500, message: 'No se pudo registrar la vacunación. Intenta nuevamente.' }
    };
    const mappedError = knownErrors[errorCode] ?? knownErrors.VACCINATION_CREATE_FAILED;
    const responseCode = knownErrors[errorCode] ? errorCode : 'VACCINATION_CREATE_FAILED';

    response.status(mappedError.status).json({
      success: false,
      data: null,
      error: { code: responseCode, message: mappedError.message }
    });
  }
};