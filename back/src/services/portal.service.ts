import { getSupabaseClient } from '../config/supabase';

export class PortalService {
  static async getDashboard(ownerId: number) {
    const supabase = getSupabaseClient();
    const { data: owner, error: ownerError } = await supabase
      .from('owners')
      .select('id, full_name, phone, email, address')
      .eq('id', ownerId)
      .single();
    if (ownerError || !owner) throw new Error('OWNER_NOT_FOUND');
    const { data: pets, error: petsError } = await supabase
      .from('pets')
      .select('id, owner_id, pet_tag, name, species, breed, birth_date, weight')
      .eq('owner_id', ownerId)
      .order('name');
    if (petsError) throw new Error(`PORTAL_PETS_FAILED: ${petsError.message}`);
    const petIds = (pets ?? []).map((pet) => pet.id);
    const [appointmentsResult, vaccinationsResult] = await Promise.all([
      petIds.length
        ? supabase
            .from('appointments')
            .select('id, pet_id, vet_id, scheduled_at, reason, notes, status')
            .in('pet_id', petIds)
            .order('scheduled_at', { ascending: false })
        : { data: [], error: null },
      petIds.length
        ? supabase
            .from('vaccinations')
            .select('id, pet_id, vaccine_name, administered_at, next_due_date, status')
            .in('pet_id', petIds)
            .order('next_due_date')
        : { data: [], error: null },
    ]);
    if (appointmentsResult.error) throw new Error(`PORTAL_APPOINTMENTS_FAILED: ${appointmentsResult.error.message}`);
    if (vaccinationsResult.error) throw new Error(`PORTAL_VACCINATIONS_FAILED: ${vaccinationsResult.error.message}`);
    return {
      owner,
      pets: pets ?? [],
      appointments: appointmentsResult.data ?? [],
      vaccinations: vaccinationsResult.data ?? [],
    };
  }
}
