import { getSupabaseClient } from '../config/supabase';
import { CreatePetInput, Pet, UpdatePetInput } from '../types/pet';

interface PetRow {
  id: number;
  created_at: string;
  owner_id: number;
  pet_tag: string;
  name: string;
  species: string;
  breed: string | null;
  birth_date: string | null;
  weight: number | null;
  owners: { full_name: string }[] | null;
}

const petSelect = 'id, owner_id, pet_tag, name, species, breed, birth_date, weight, created_at, owners(full_name)';

const toPet = (row: PetRow): Pet => ({
  id: row.id,
  createdAt: row.created_at,
  ownerId: row.owner_id,
  ownerName: row.owners?.[0]?.full_name ?? 'Propietario sin nombre',
  petTag: row.pet_tag,
  name: row.name,
  species: row.species,
  breed: row.breed,
  birthDate: row.birth_date,
  weight: row.weight,
});

export class PetService {
  static async list(): Promise<Pet[]> {
    const { data, error } = await getSupabaseClient()
      .from('pets')
      .select(petSelect)
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) throw new Error(`PETS_LIST_FAILED: ${error.message}`);
    return (data as PetRow[]).map(toPet);
  }

  static async create(input: CreatePetInput): Promise<Pet> {
    const { data, error } = await getSupabaseClient()
      .from('pets')
      .insert({
        owner_id: input.ownerId,
        pet_tag: input.petTag.trim(),
        name: input.name.trim(),
        species: input.species.trim(),
        breed: input.breed?.trim() || null,
        birth_date: input.birthDate || null,
        weight: input.weight ?? null,
      })
      .select(petSelect)
      .single();

    if (error || !data) {
      if (error?.code === '23503') throw new Error('OWNER_NOT_FOUND');
      if (error?.code === '23505') throw new Error('PET_TAG_ALREADY_EXISTS');
      throw new Error('PET_CREATE_FAILED');
    }

    return toPet(data as PetRow);
  }

  static async update(id: number, input: UpdatePetInput): Promise<Pet> {
    const values: Record<string, number | string | null> = {};
    if (input.ownerId !== undefined) values.owner_id = input.ownerId;
    if (input.petTag !== undefined) values.pet_tag = input.petTag.trim();
    if (input.name !== undefined) values.name = input.name.trim();
    if (input.species !== undefined) values.species = input.species.trim();
    if (input.breed !== undefined) values.breed = input.breed?.trim() || null;
    if (input.birthDate !== undefined) values.birth_date = input.birthDate || null;
    if (input.weight !== undefined) values.weight = input.weight;

    const { data, error } = await getSupabaseClient()
      .from('pets')
      .update(values)
      .eq('id', id)
      .is('deleted_at', null)
      .select(petSelect)
      .maybeSingle();
    if (error) {
      if (error.code === '23503') throw new Error('OWNER_NOT_FOUND');
      if (error.code === '23505') throw new Error('PET_TAG_ALREADY_EXISTS');
      throw new Error(`PET_UPDATE_FAILED: ${error.message}`);
    }
    if (!data) throw new Error('PET_NOT_FOUND');
    return toPet(data as PetRow);
  }

  static async setDeleted(id: number, deleted: boolean): Promise<Pet> {
    const { data, error } = await getSupabaseClient()
      .from('pets')
      .update({ deleted_at: deleted ? new Date().toISOString() : null })
      .eq('id', id)
      .select(petSelect)
      .maybeSingle();
    if (error) throw new Error(`PET_DELETE_FAILED: ${error.message}`);
    if (!data) throw new Error('PET_NOT_FOUND');
    return toPet(data as PetRow);
  }
}
