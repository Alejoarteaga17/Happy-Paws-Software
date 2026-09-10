import { Request, Response } from 'express';
import { VaccinationService } from '../services/vaccination.service';

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
  const { petId, vaccineName, administeredAt, nextDueDate } = request.body as Record<string, unknown>;
  if (typeof petId !== 'number' || typeof vaccineName !== 'string' || typeof administeredAt !== 'string' || typeof nextDueDate !== 'string') {
    response.status(400).json({ success: false, data: null, error: { code: 'INVALID_VACCINATION', message: 'Datos de vacunación inválidos' } });
    return;
  }

  try {
    const data = await VaccinationService.create({ petId, vaccineName, administeredAt, nextDueDate });
    response.status(201).json({ success: true, data, error: null });
  } catch (error) {
    response.status(500).json({
      success: false,
      data: null,
      error: { code: 'VACCINATION_CREATE_FAILED', message: error instanceof Error ? error.message : 'Error interno' }
    });
  }
};