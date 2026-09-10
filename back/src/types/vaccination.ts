export type VaccinationStatus = 'ADMINISTERED' | 'PENDING' | 'OVERDUE';

export interface Vaccination {
  id: number;
  petId: number;
  petName: string;
  vaccineName: string;
  administeredAt: string;
  nextDueDate: string;
  status: VaccinationStatus;
}

export interface CreateVaccinationInput {
  petId: number;
  vaccineName: string;
  administeredAt: string;
  nextDueDate: string;
  status?: VaccinationStatus;
}