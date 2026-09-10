import { getSupabaseClient } from '../config/supabase';
import { CreateVaccinationInput, Vaccination, VaccinationStatus } from '../types/vaccination';

interface VaccinationRow {
  id: number;
  pet_id: number;
  vaccine_name: string;
  administered_at: string;
  next_due_date: string;
  status: VaccinationStatus;
  pets: { name: string } | { name: string }[] | null;
}

const getPetName = (pets: VaccinationRow['pets']): string | undefined => Array.isArray(pets) ? pets[0]?.name : pets?.name;

const toVaccination = (row: VaccinationRow): Vaccination => ({
  id: row.id,
  petId: row.pet_id,
  petName: getPetName(row.pets) ?? 'Mascota sin nombre',
  vaccineName: row.vaccine_name,
  administeredAt: row.administered_at,
  nextDueDate: row.next_due_date,
  status: row.status
});

export class VaccinationService {
  static async list(): Promise<Vaccination[]> {
    const { data, error } = await getSupabaseClient()
      .from('vaccinations')
      .select('id, pet_id, vaccine_name, administered_at, next_due_date, status, pets(name)')
      .order('next_due_date', { ascending: true });

    if (error) {
      throw new Error(`VACCINATIONS_LIST_FAILED: ${error.message}`);
    }

    return (data as VaccinationRow[]).map(toVaccination);
  }

  static async create(input: CreateVaccinationInput): Promise<Vaccination> {
    const supabase = getSupabaseClient();
    const { data: pet, error: petLookupError } = await supabase
      .from('pets')
      .select('id')
      .eq('id', input.petId)
      .maybeSingle();

    if (petLookupError) {
      throw new Error('PET_LOOKUP_FAILED');
    }

    if (!pet) {
      throw new Error('PET_NOT_FOUND');
    }

    const { data, error } = await supabase
      .from('vaccinations')
      .insert({
        pet_id: input.petId,
        vaccine_name: input.vaccineName,
        administered_at: input.administeredAt,
        next_due_date: input.nextDueDate,
        status: input.status ?? getVaccinationStatus(input.administeredAt, input.nextDueDate)
      })
      .select('id, pet_id, vaccine_name, administered_at, next_due_date, status, pets(name)')
      .single();

    if (error || !data) {
      if (error?.code === '23503') {
        throw new Error('PET_NOT_FOUND');
      }

      throw new Error('VACCINATION_CREATE_FAILED');
    }

    return toVaccination(data as VaccinationRow);
  }
}

export const getVaccinationStatus = (administeredAt: string, nextDueDate?: string, today = new Date()): VaccinationStatus => {
  const administeredDate = new Date(`${administeredAt}T00:00:00Z`);
  const dueDate = new Date(`${nextDueDate ?? administeredAt}T00:00:00Z`);
  const currentDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  if (administeredDate > currentDate) return 'PENDING';
  return dueDate < currentDate ? 'OVERDUE' : 'ADMINISTERED';
};