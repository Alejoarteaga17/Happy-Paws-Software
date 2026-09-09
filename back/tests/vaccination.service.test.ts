import { getVaccinationStatus } from '../src/services/vaccination.service';

describe('getVaccinationStatus', () => {
  const today = new Date('2026-09-09T12:00:00Z');

  it('marks dates before today as overdue', () => {
    expect(getVaccinationStatus('2026-09-08', today)).toBe('OVERDUE');
  });

  it('keeps today and future dates pending', () => {
    expect(getVaccinationStatus('2026-09-09', today)).toBe('PENDING');
    expect(getVaccinationStatus('2026-10-01', today)).toBe('PENDING');
  });
});