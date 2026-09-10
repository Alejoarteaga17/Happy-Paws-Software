import { getSupabaseClient } from '../config/supabase';

interface PetRow {
  id: number;
  name: string;
}

interface VaccinationSeed {
  pet_id: number;
  vaccine_name: string;
  administered_at: string;
  next_due_date: string;
  status: 'PENDING' | 'OVERDUE';
}

const vaccinationTemplates = [
  { vaccineName: 'Rabia', administeredAt: '2025-09-05', nextDueDate: '2026-09-12', status: 'PENDING' as const },
  { vaccineName: 'Séxtuple', administeredAt: '2025-03-11', nextDueDate: '2026-08-29', status: 'OVERDUE' as const },
  { vaccineName: 'Triple felina', administeredAt: '2025-10-02', nextDueDate: '2026-09-18', status: 'PENDING' as const },
  { vaccineName: 'Leucemia felina', administeredAt: '2025-02-17', nextDueDate: '2026-08-19', status: 'OVERDUE' as const }
];

async function seedVaccinations(): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: pets, error: petsError } = await supabase.from('pets').select('id, name').order('id').limit(vaccinationTemplates.length);

  if (petsError) {
    throw new Error(`No se pudieron consultar las mascotas: ${petsError.message}`);
  }

  const availablePets = (pets ?? []) as PetRow[];
  if (availablePets.length < vaccinationTemplates.length) {
    throw new Error(`Se requieren al menos ${vaccinationTemplates.length} mascotas en Supabase; solo hay ${availablePets.length}.`);
  }

  const seeds: VaccinationSeed[] = availablePets.map((pet, index) => ({
    pet_id: pet.id,
    vaccine_name: vaccinationTemplates[index].vaccineName,
    administered_at: vaccinationTemplates[index].administeredAt,
    next_due_date: vaccinationTemplates[index].nextDueDate,
    status: vaccinationTemplates[index].status
  }));

  const { data: existing, error: existingError } = await supabase
    .from('vaccinations')
    .select('pet_id, vaccine_name, next_due_date')
    .in('pet_id', seeds.map(({ pet_id }) => pet_id));

  if (existingError) {
    throw new Error(`No se pudieron comprobar vacunaciones existentes: ${existingError.message}`);
  }

  const newSeeds = seeds.filter((seed) => !(existing ?? []).some((row) => (
    row.pet_id === seed.pet_id &&
    row.vaccine_name === seed.vaccine_name &&
    row.next_due_date === seed.next_due_date
  )));

  if (newSeeds.length === 0) {
    console.log('Las vacunaciones simuladas ya existen. No se insertaron duplicados.');
    return;
  }

  const { error: insertError } = await supabase.from('vaccinations').insert(newSeeds);
  if (insertError) {
    throw new Error(`No se pudieron insertar las vacunaciones: ${insertError.message}`);
  }

  console.log(`Se insertaron ${newSeeds.length} vacunaciones simuladas en Supabase.`);
  newSeeds.forEach((seed) => {
    const pet = availablePets.find(({ id }) => id === seed.pet_id);
    console.log(`- ${pet?.name ?? seed.pet_id}: ${seed.vaccine_name} (${seed.status})`);
  });
}

seedVaccinations().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Error desconocido al cargar datos');
  process.exitCode = 1;
});