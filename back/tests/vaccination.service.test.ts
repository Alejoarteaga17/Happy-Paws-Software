import { getVaccinationStatus } from '../src/services/vaccination.service';

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