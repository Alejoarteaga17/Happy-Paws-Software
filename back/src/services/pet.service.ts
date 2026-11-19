import { getSupabaseClient } from '../config/supabase';
import { CreatePetInput, Pet, UpdatePetInput } from '../types/pet';

interface PetRow {
  id: number;
  created_at: string;
  updated_at: string;
  owner_id: number;
  pet_tag: string;
  name: string;
  species: string;
  breed: string | null;
  birth_date: string | null;
  weight: number | null;
  sex: Pet['sex'];
  photo_url?: string | null;
  owners: { full_name: string }[] | null;
}

const petSelect =
  'id, owner_id, pet_tag, name, species, breed, birth_date, weight, sex, photo_url, created_at, updated_at, owners(full_name)';
const petSelectWithoutPhotos =
  'id, owner_id, pet_tag, name, species, breed, birth_date, weight, sex, created_at, updated_at, owners(full_name)';

const toPet = (row: PetRow): Pet => ({
  id: row.id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  ownerId: row.owner_id,
  ownerName: row.owners?.[0]?.full_name ?? 'Propietario sin nombre',
  petTag: row.pet_tag,
  name: row.name,
  species: row.species,
  breed: row.breed,
  birthDate: row.birth_date,
  weight: row.weight,
  sex: row.sex,
  photoUrl: row.photo_url ?? null,
});

export class PetService {
  private static async assertActiveOwner(ownerId: number): Promise<void> {
    const { data, error } = await getSupabaseClient()
      .from('owners')
      .select('id')
      .eq('id', ownerId)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw new Error(`OWNER_LOOKUP_FAILED: ${error.message}`);
    if (!data) throw new Error('OWNER_INACTIVE');
  }

  static async list(): Promise<Pet[]> {
    const firstResult = await getSupabaseClient()
      .from('pets')
      .select(petSelect)
      .is('deleted_at', null)
      .order('name', { ascending: true });
    let data: unknown = firstResult.data;
    let error = firstResult.error;
    if (error?.code === '42703') {
      const fallbackResult = await getSupabaseClient()
        .from('pets')
        .select(petSelectWithoutPhotos)
        .is('deleted_at', null)
        .order('name', { ascending: true });
      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error) throw new Error(`PETS_LIST_FAILED: ${error.message}`);
    return (data as PetRow[]).map(toPet);
  }

  static async create(input: CreatePetInput): Promise<Pet> {
    await PetService.assertActiveOwner(input.ownerId);
    const values = {
      owner_id: input.ownerId,
      pet_tag: input.petTag.trim(),
      name: input.name.trim(),
      species: input.species.trim(),
      breed: input.breed?.trim() || null,
      birth_date: input.birthDate || null,
      weight: input.weight ?? null,
      sex: input.sex ?? null,
      photo_url: input.photoUrl?.trim() || null,
    };
    let insertQuery = getSupabaseClient().from('pets').insert(values);
    let firstResult = await insertQuery.select(petSelect).single();
    let data: unknown = firstResult.data;
    let error = firstResult.error;
    if (error?.code === '42703') {
      const { photo_url: _photoUrl, ...valuesWithoutPhoto } = values;
      insertQuery = getSupabaseClient().from('pets').insert(valuesWithoutPhoto);
      const fallbackResult = await insertQuery.select(petSelectWithoutPhotos).single();
      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error || !data) {
      if (error?.code === '23503') throw new Error('OWNER_NOT_FOUND');
      if (error?.code === '23505') throw new Error('PET_TAG_ALREADY_EXISTS');
      throw new Error('PET_CREATE_FAILED');
    }

    return toPet(data as PetRow);
  }

  static async update(id: number, input: UpdatePetInput): Promise<Pet> {
    const values: Record<string, number | string | null> = {};
    if (input.ownerId !== undefined) {
      await PetService.assertActiveOwner(input.ownerId);
      values.owner_id = input.ownerId;
    }
    if (input.petTag !== undefined) values.pet_tag = input.petTag.trim();
    if (input.name !== undefined) values.name = input.name.trim();
    if (input.species !== undefined) values.species = input.species.trim();
    if (input.breed !== undefined) values.breed = input.breed?.trim() || null;
    if (input.birthDate !== undefined) values.birth_date = input.birthDate || null;
    if (input.weight !== undefined) values.weight = input.weight;
    if (input.sex !== undefined) values.sex = input.sex;
    if (input.photoUrl !== undefined) values.photo_url = input.photoUrl?.trim() || null;

    let updateQuery = getSupabaseClient().from('pets').update(values);
    let firstResult = await updateQuery.eq('id', id).is('deleted_at', null).select(petSelect).maybeSingle();
    let data: unknown = firstResult.data;
    let error = firstResult.error;
    if (error?.code === '42703') {
      const { photo_url: _photoUrl, ...valuesWithoutPhoto } = values;
      updateQuery = getSupabaseClient().from('pets').update(valuesWithoutPhoto);
      const fallbackResult = await updateQuery
        .eq('id', id)
        .is('deleted_at', null)
        .select(petSelectWithoutPhotos)
        .maybeSingle();
      data = fallbackResult.data;
      error = fallbackResult.error;
    }
    if (error) {
      if (error.code === '23503') throw new Error('OWNER_NOT_FOUND');
      if (error.code === '23505') throw new Error('PET_TAG_ALREADY_EXISTS');
      throw new Error(`PET_UPDATE_FAILED: ${error.message}`);
    }
    if (!data) throw new Error('PET_NOT_FOUND');
    return toPet(data as PetRow);
  }

  static async setDeleted(id: number, deleted: boolean): Promise<Pet> {
    const firstResult = await getSupabaseClient()
      .from('pets')
      .update({ deleted_at: deleted ? new Date().toISOString() : null })
      .eq('id', id)
      .select(petSelect)
      .maybeSingle();
    let data: unknown = firstResult.data;
    let error = firstResult.error;
    if (error?.code === '42703') {
      const fallbackResult = await getSupabaseClient()
        .from('pets')
        .update({ deleted_at: deleted ? new Date().toISOString() : null })
        .eq('id', id)
        .select(petSelectWithoutPhotos)
        .maybeSingle();
      data = fallbackResult.data;
      error = fallbackResult.error;
    }
    if (error) throw new Error(`PET_DELETE_FAILED: ${error.message}`);
    if (!data) throw new Error('PET_NOT_FOUND');
    return toPet(data as PetRow);
  }
}
