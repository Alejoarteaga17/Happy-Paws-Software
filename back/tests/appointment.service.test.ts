import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getSupabaseClient } from '../src/config/supabase';
import { AppointmentService } from '../src/services/appointment.service';

jest.mock('../src/config/supabase', () => ({ getSupabaseClient: jest.fn() }));
const mockedGetSupabaseClient = jest.mocked(getSupabaseClient);

const appointmentRow = {
  id: 4,
  pet_id: 2,
  vet_id: 'vet-1',
  scheduled_at: '2026-09-11T14:00:00Z',
  reason: 'Control',
  notes: null,
  status: 'SCHEDULED',
  pets: [{ name: 'Milo' }],
};

describe('AppointmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps a many-to-one pet relation returned as an object', async () => {
    const missedUpdate = { eq: jest.fn().mockReturnValue({ lt: jest.fn(async () => ({ error: null })) }) };
    const appointmentList = {
      order: jest.fn(async () => ({ data: [{ ...appointmentRow, pets: { name: 'Milo' } }], error: null })),
    };
    const from = jest
      .fn()
      .mockReturnValueOnce({ update: jest.fn().mockReturnValue(missedUpdate) })
      .mockReturnValueOnce({ select: jest.fn().mockReturnValue(appointmentList) });
    mockedGetSupabaseClient.mockReturnValue({ from } as never);

    await expect(AppointmentService.list()).resolves.toMatchObject([{ petName: 'Milo' }]);
  });

  it('assigns the first available vet when one is not provided', async () => {
    const vetLookup = { maybeSingle: jest.fn(async () => ({ data: { id: 'vet-1' }, error: null })) };
    const appointmentInsert = { single: jest.fn(async () => ({ data: appointmentRow, error: null })) };
    const appointmentSelect = jest.fn().mockReturnValue(appointmentInsert);
    const insert = jest.fn().mockReturnValue({ select: appointmentSelect });
    const from = jest
      .fn()
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest
            .fn()
            .mockReturnValue({ order: jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue(vetLookup) }) }),
        }),
      })
      .mockReturnValueOnce({ insert });
    mockedGetSupabaseClient.mockReturnValue({ from } as never);

    await expect(
      AppointmentService.create({ petId: 2, scheduledAt: appointmentRow.scheduled_at, reason: 'Control' }),
    ).resolves.toMatchObject({ id: 4, petName: 'Milo', vetId: 'vet-1' });
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ pet_id: 2, vet_id: 'vet-1', status: 'SCHEDULED' }));
  });

  it('returns not found when an appointment cannot be loaded', async () => {
    const maybeSingle = jest.fn(async () => ({ data: null, error: null }));
    const eq = jest.fn().mockReturnValue({ maybeSingle });
    const missedUpdate = { eq: jest.fn().mockReturnValue({ lt: jest.fn(async () => ({ error: null })) }) };
    mockedGetSupabaseClient.mockReturnValue({
      from: jest
        .fn()
        .mockReturnValueOnce({ update: jest.fn().mockReturnValue(missedUpdate) })
        .mockReturnValueOnce({ select: jest.fn().mockReturnValue({ eq }) }),
    } as never);

    await expect(AppointmentService.getById(999)).rejects.toThrow('APPOINTMENT_NOT_FOUND');
  });

  it('marks past scheduled appointments as missed before listing them', async () => {
    const update = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({ lt: jest.fn(async () => ({ error: null })) }),
    });
    const order = jest.fn(async () => ({ data: [], error: null }));
    const from = jest
      .fn()
      .mockReturnValueOnce({ update })
      .mockReturnValueOnce({ select: jest.fn().mockReturnValue({ order }) });
    mockedGetSupabaseClient.mockReturnValue({ from } as never);

    await AppointmentService.list();
    expect(update).toHaveBeenCalledWith({ status: 'MISSED' });
  });

  it('cancels an appointment through the update operation', async () => {
    const maybeSingle = jest.fn(async () => ({ data: appointmentRow, error: null }));
    const eq = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ maybeSingle }) });
    const update = jest.fn().mockReturnValue({ eq });
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue({ update }) } as never);

    await AppointmentService.cancel(4);
    expect(update).toHaveBeenCalledWith({ status: 'CANCELLED' });
  });

  it('persists a standardized clinical note when updating an appointment', async () => {
    const maybeSingle = jest.fn(async () => ({ data: appointmentRow, error: null }));
    const eq = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ maybeSingle }) });
    const update = jest.fn().mockReturnValue({ eq });
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue({ update }) } as never);

    await AppointmentService.update(4, { notes: '  Hallazgos: estable. Tratamiento: control.  ' });

    expect(update).toHaveBeenCalledWith({ notes: 'Hallazgos: estable. Tratamiento: control.' });
  });
});
