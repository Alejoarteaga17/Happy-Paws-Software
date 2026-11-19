import { Appointment } from './appointment';
import { Pet } from './pet';
import { Vaccination } from './vaccination';
import { ClinicalNote } from './clinical-note';

export interface OwnerPortalData {
  owner: {
    id: number;
    fullName: string;
    phone: string;
    email: string | null;
    address: string | null;
  };
  pets: Pet[];
  appointments: Appointment[];
  vaccinations: Vaccination[];
  clinicalNotes: ClinicalNote[];
}
