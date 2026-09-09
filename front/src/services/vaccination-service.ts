import { Vaccination } from '../types/vaccination';

const demoVaccinations: Vaccination[] = [
  { id: 1, petId: 1, petName: 'Luna', vaccineName: 'Rabia', administeredAt: '2025-09-05', nextDueDate: '2026-09-12', status: 'PENDING' },
  { id: 2, petId: 2, petName: 'Bruno', vaccineName: 'Séxtuple', administeredAt: '2025-03-11', nextDueDate: '2026-08-29', status: 'OVERDUE' },
  { id: 3, petId: 3, petName: 'Milo', vaccineName: 'Triple felina', administeredAt: '2025-10-02', nextDueDate: '2026-09-18', status: 'PENDING' },
  { id: 4, petId: 4, petName: 'Nala', vaccineName: 'Leucemia felina', administeredAt: '2025-02-17', nextDueDate: '2026-08-19', status: 'OVERDUE' }
];

export async function getVaccinations(): Promise<Vaccination[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return demoVaccinations;

  try {
    const response = await fetch(`${apiUrl}/api/v1/vaccinations`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Vaccination request failed');
    const payload = (await response.json()) as { success: boolean; data: Vaccination[] };
    return payload.success ? payload.data : demoVaccinations;
  } catch {
    return demoVaccinations;
  }
}