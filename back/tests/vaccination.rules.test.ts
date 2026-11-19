import { describe, expect, it } from '@jest/globals';
import { getVaccinationStatus } from '../src/services/vaccination.service';

describe('vaccination business rules', () => {
  const today = new Date('2026-11-15T12:00:00Z');

  it('marks future administrations as pending', () => {
    expect(getVaccinationStatus('2026-11-16', '2027-11-16', today)).toBe('PENDING');
  });

  it('marks past due dates as overdue', () => {
    expect(getVaccinationStatus('2026-01-01', '2026-11-14', today)).toBe('OVERDUE');
  });

  it('keeps current vaccinations administered', () => {
    expect(getVaccinationStatus('2026-01-01', '2026-11-15', today)).toBe('ADMINISTERED');
  });
});
