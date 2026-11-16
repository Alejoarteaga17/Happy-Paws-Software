import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getSupabaseClient } from '../src/config/supabase';
import { ClinicalNoteService } from '../src/services/clinical-note.service';

jest.mock('../src/config/supabase', () => ({ getSupabaseClient: jest.fn() }));

const mockedGetSupabaseClient = jest.mocked(getSupabaseClient);

const noteRow = {
  id: 1,
  appointment_id: 9,
  veterinarian_id: 'vet-1',
  diagnosis: 'Dermatitis',
  treatment: 'Baño medicado',
  observations: null,
  created_at: '2026-11-01T10:00:00Z',
  updated_at: '2026-11-01T10:00:00Z',
  appointments: [{ pet_id: 3, pets: [{ name: 'Luna' }] }],
  profiles: [{ full_name: 'Dr. Vet' }],
};

describe('ClinicalNoteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a note only for an existing assigned appointment', async () => {
    const appointmentMaybeSingle = jest.fn(async () => ({ data: { id: 9, vet_id: 'vet-1' }, error: null }));
    const appointmentQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: appointmentMaybeSingle,
    };
    const noteSingle = jest.fn(async () => ({ data: noteRow, error: null }));
    const noteQuery = { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: noteSingle };
    const from = jest.fn((table: string) => (table === 'appointments' ? appointmentQuery : noteQuery));
    mockedGetSupabaseClient.mockReturnValue({ from } as never);

    await expect(
      ClinicalNoteService.create(
        { appointmentId: 9, diagnosis: ' Dermatitis ', treatment: ' Baño medicado ' },
        'vet-1',
      ),
    ).resolves.toMatchObject({ appointmentId: 9, petName: 'Luna', diagnosis: 'Dermatitis' });
    expect(noteQuery.insert).toHaveBeenCalledWith(
      expect.objectContaining({ appointment_id: 9, veterinarian_id: 'vet-1', diagnosis: 'Dermatitis' }),
    );
  });

  it('rejects notes from appointments assigned to another veterinarian', async () => {
    const maybeSingle = jest.fn(async () => ({ data: { id: 9, vet_id: 'other-vet' }, error: null }));
    mockedGetSupabaseClient.mockReturnValue({
      from: jest
        .fn()
        .mockReturnValue({ select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ maybeSingle }) }) }),
    } as never);

    await expect(
      ClinicalNoteService.create({ appointmentId: 9, diagnosis: 'D', treatment: 'T' }, 'vet-1'),
    ).rejects.toThrow('APPOINTMENT_NOT_ASSIGNED');
  });

  it('restricts veterinarian updates to their own notes unless elevated', async () => {
    const maybeSingle = jest.fn(async () => ({ data: noteRow, error: null }));
    const select = jest.fn().mockReturnValue({ maybeSingle });
    const veterinarianEq = jest.fn().mockReturnValue({ select });
    const idEq = jest.fn().mockReturnValue({ eq: veterinarianEq, select });
    const update = jest.fn().mockReturnValue({ eq: idEq });
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue({ update }) } as never);

    await ClinicalNoteService.update(1, { diagnosis: 'Nueva' }, 'vet-1', false);
    expect(veterinarianEq).toHaveBeenCalledWith('veterinarian_id', 'vet-1');

    await ClinicalNoteService.update(1, { treatment: 'Otro' }, 'admin-1', true);
    expect(veterinarianEq).toHaveBeenCalledTimes(1);
  });
});
