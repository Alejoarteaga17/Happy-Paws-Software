import { getVaccinationStatus, VaccinationService } from '../src/services/vaccination.service';

jest.mock('../src/config/supabase', () => ({ getSupabaseClient: jest.fn() }));
import { getSupabaseClient } from '../src/config/supabase';

const mockedGetSupabaseClient = jest.mocked(getSupabaseClient);

describe('getVaccinationStatus', () => {
  const today = new Date('2026-09-09T12:00:00Z');

  it('marks dates before today as overdue', () => {
    expect(getVaccinationStatus('2026-09-01', '2026-09-08', today)).toBe('OVERDUE');
  });

  it('marks a future administration as pending', () => {
    expect(getVaccinationStatus('2026-09-10', '2026-10-01', today)).toBe('PENDING');
  });

  it('marks a current administration as administered', () => {
    expect(getVaccinationStatus('2026-09-09', '2026-10-01', today)).toBe('ADMINISTERED');
  });
});

describe('VaccinationService', () => {
  it('maps a many-to-one pet relation returned as an object', async () => {
    const vaccinationList = {
      order: jest.fn(async () => ({
        data: [{
          id: 1,
          pet_id: 7,
          vaccine_name: 'Rabia',
          administered_at: '2026-09-09',
          next_due_date: '2027-09-09',
          status: 'ADMINISTERED',
          pets: { name: 'Luna' }
        }],
        error: null
      }))
    };
    const from = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue(vaccinationList) });
    mockedGetSupabaseClient.mockReturnValue({ from } as never);

    await expect(VaccinationService.list()).resolves.toMatchObject([{ petName: 'Luna' }]);
  });
});