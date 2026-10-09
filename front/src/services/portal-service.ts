import { getSupabaseClient, isSupabaseConfigured } from './supabase-client';
import { Appointment } from '../types/appointment';
import { OwnerPortalData } from '../types/portal';
import { Pet } from '../types/pet';
import { Vaccination } from '../types/vaccination';

interface PortalRow {
  owner: {
    id: number;
    full_name: string;
    phone: string;
    email: string | null;
    address: string | null;
  };
  pets: Array<{
    id: number;
    owner_id: number;
    pet_tag: string;
    name: string;
    species: string;
    breed: string | null;
    birth_date: string | null;
    weight: number | null;
    created_at: string;
  }>;
  appointments: Array<{
    id: number;
    pet_id: number;
    vet_id: string | null;
    scheduled_at: string;
    reason: string;
    notes: string | null;
    status: Appointment['status'];
  }>;
  vaccinations: Array<{
    id: number;
    pet_id: number;
    vaccine_name: string;
    administered_at: string;
    next_due_date: string;
    status: Vaccination['status'];
  }>;
}

interface ApiError {
  message?: string;
}

const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  if (!apiUrl || !URL.canParse(apiUrl)) throw new Error('NEXT_PUBLIC_API_URL no es una URL válida');
  return apiUrl;
};

const getHeaders = async (): Promise<HeadersInit> => {
  if (!isSupabaseConfigured) throw new Error('Configura Supabase e inicia sesión para consultar el portal');
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw new Error(`Supabase session failed: ${error.message}`);
  if (!data.session) throw new Error('Debes iniciar sesión para consultar el portal');
  return { Authorization: `Bearer ${data.session.access_token}` };
};

const mapPortal = (row: PortalRow): OwnerPortalData => {
  const petNames = new Map(row.pets.map((pet) => [pet.id, pet.name]));
  return {
    owner: {
      id: row.owner.id,
      fullName: row.owner.full_name,
      phone: row.owner.phone,
      email: row.owner.email,
      address: row.owner.address,
    },
    pets: row.pets.map((pet): Pet => ({
      id: pet.id,
      createdAt: pet.created_at,
      ownerId: pet.owner_id,
      ownerName: row.owner.full_name,
      petTag: pet.pet_tag,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      birthDate: pet.birth_date,
      weight: pet.weight,
    })),
    appointments: row.appointments.map((appointment): Appointment => ({
      id: appointment.id,
      petId: appointment.pet_id,
      petName: petNames.get(appointment.pet_id) ?? 'Mascota sin nombre',
      vetId: appointment.vet_id,
      scheduledAt: appointment.scheduled_at,
      reason: appointment.reason,
      notes: appointment.notes,
      status: appointment.status,
    })),
    vaccinations: row.vaccinations.map((vaccination): Vaccination => ({
      id: vaccination.id,
      petId: vaccination.pet_id,
      petName: petNames.get(vaccination.pet_id) ?? 'Mascota sin nombre',
      vaccineName: vaccination.vaccine_name,
      administeredAt: vaccination.administered_at,
      nextDueDate: vaccination.next_due_date,
      status: vaccination.status,
    })),
  };
};

export async function getOwnerPortal(): Promise<OwnerPortalData> {
  const response = await fetch(`${getApiUrl()}/api/v1/portal/me`, {
    cache: 'no-store',
    headers: await getHeaders(),
  });
  const payload = (await response.json()) as { success: boolean; data: PortalRow | null; error: ApiError | null };
  if (!response.ok || !payload.success || payload.data === null) {
    throw new Error(payload.error?.message ?? 'No se pudo cargar el portal');
  }
  return mapPortal(payload.data);
}

export { mapPortal };
