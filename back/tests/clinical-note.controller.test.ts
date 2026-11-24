import { describe, expect, it, jest } from '@jest/globals';
import { ClinicalNoteService } from '../src/services/clinical-note.service';
import { AuditService } from '../src/services/audit.service';
import { createClinicalNote, updateClinicalNote } from '../src/controllers/clinical-note.controller';

jest.mock('../src/services/clinical-note.service', () => ({
  ClinicalNoteService: { create: jest.fn(), update: jest.fn() },
}));
jest.mock('../src/services/audit.service', () => ({
  AuditService: { record: jest.fn() },
}));

const mockedCreate = jest.mocked(ClinicalNoteService.create);
const mockedUpdate = jest.mocked(ClinicalNoteService.update);

const response = () => {
  const result = { statusCode: 200, body: undefined as unknown };
  const responseMock = {
    status: jest.fn((statusCode: number) => {
      result.statusCode = statusCode;
      return responseMock;
    }),
    json: jest.fn((body: unknown) => {
      result.body = body;
      return responseMock;
    }),
  };
  return { responseMock, result };
};

const vetRequest = (body: Record<string, unknown>) => ({
  body,
  user: { id: 'vet-1', email: 'vet@example.com', role: 'VET', ownerId: null },
});

describe('clinical note controllers', () => {
  it('rejects incomplete notes before writing clinical data', async () => {
    const { responseMock, result } = response();

    await createClinicalNote(vetRequest({ appointmentId: 4, diagnosis: '' }) as never, responseMock as never);

    expect(result.statusCode).toBe(400);
    expect(result.body).toMatchObject({ error: { code: 'INVALID_CLINICAL_NOTE' } });
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('creates a note and audits the operation', async () => {
    const { responseMock, result } = response();
    mockedCreate.mockResolvedValue({ id: 5 } as never);

    await createClinicalNote(
      vetRequest({ appointmentId: 4, diagnosis: 'Dermatitis', treatment: 'Baño' }) as never,
      responseMock as never,
    );

    expect(result.statusCode).toBe(201);
    expect(mockedCreate).toHaveBeenCalledWith(
      { appointmentId: 4, diagnosis: 'Dermatitis', treatment: 'Baño', observations: undefined },
      'vet-1',
    );
    expect(AuditService.record).toHaveBeenCalled();
  });

  it('explains when a veterinarian selects an appointment assigned to someone else', async () => {
    const { responseMock, result } = response();
    mockedCreate.mockRejectedValueOnce(new Error('APPOINTMENT_NOT_ASSIGNED'));

    await createClinicalNote(
      vetRequest({ appointmentId: 4, diagnosis: 'Dermatitis', treatment: 'Baño' }) as never,
      responseMock as never,
    );

    expect(result.statusCode).toBe(403);
    expect(result.body).toMatchObject({
      error: {
        code: 'APPOINTMENT_NOT_ASSIGNED',
        message: 'Solo puedes registrar notas para citas asignadas a tu perfil.',
      },
    });
  });

  it('forwards ownership restrictions as forbidden responses', async () => {
    const { responseMock, result } = response();
    mockedUpdate.mockRejectedValue(new Error('CLINICAL_NOTE_NOT_FOUND'));

    await updateClinicalNote(
      { params: { id: '5' }, body: { diagnosis: 'Nueva' }, user: vetRequest({}).user } as never,
      responseMock as never,
    );

    expect(result.statusCode).toBe(404);
    expect(result.body).toMatchObject({ error: { code: 'CLINICAL_NOTE_NOT_FOUND' } });
  });
});
