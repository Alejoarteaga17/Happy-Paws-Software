import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';
import { ClinicalNoteService } from '../services/clinical-note.service';

export const listClinicalNotes = async (_request: Request, response: Response): Promise<void> => {
  try {
    response.json({ success: true, data: await ClinicalNoteService.list(), error: null });
  } catch {
    response.status(500).json({
      success: false,
      data: null,
      error: { code: 'CLINICAL_NOTES_LIST_FAILED', message: 'No se pudieron cargar las notas clínicas.' },
    });
  }
};

export const createClinicalNote = async (request: Request, response: Response): Promise<void> => {
  const body = request.body as Record<string, unknown>;
  const valid =
    Number.isInteger(body.appointmentId) &&
    (body.appointmentId as number) > 0 &&
    typeof body.diagnosis === 'string' &&
    body.diagnosis.trim().length > 0 &&
    typeof body.treatment === 'string' &&
    body.treatment.trim().length > 0 &&
    (body.observations === undefined || body.observations === null || typeof body.observations === 'string');
  if (!valid || !request.user) {
    response.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_CLINICAL_NOTE', message: 'Diagnóstico, tratamiento y cita son obligatorios.' },
    });
    return;
  }
  try {
    const data = await ClinicalNoteService.create(
      {
        appointmentId: body.appointmentId as number,
        diagnosis: body.diagnosis as string,
        treatment: body.treatment as string,
        observations: body.observations as string | null | undefined,
      },
      request.user.id,
    );
    await AuditService.record({
      actorUserId: request.user.id,
      action: 'CREATE',
      entityName: 'clinical_notes',
      entityId: data.id,
    });
    response.status(201).json({ success: true, data, error: null });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'CLINICAL_NOTE_CREATE_FAILED';
    const status = code === 'APPOINTMENT_NOT_FOUND' ? 404 : 500;
    response.status(status).json({
      success: false,
      data: null,
      error: {
        code: status === 404 ? code : 'CLINICAL_NOTE_CREATE_FAILED',
        message: 'No se pudo guardar la nota clínica.',
      },
    });
  }
};
