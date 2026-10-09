import { Appointment } from './appointment';
import { Pet } from './pet';
import { Vaccination } from './vaccination';

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
}
