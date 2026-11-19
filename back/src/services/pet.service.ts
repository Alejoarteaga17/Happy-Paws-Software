import { getSupabaseClient } from '../config/supabase';
import { CreatePetInput, Pet, UpdatePetInput } from '../types/pet';
import { randomUUID } from 'crypto';

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
  owners: { full_name: string }[] | { full_name: string } | null;
}

const petSelect =
  'id, owner_id, pet_tag, name, species, breed, birth_date, weight, sex, photo_url, created_at, updated_at, owners(full_name)';
const petSelectWithoutPhotos =
  'id, owner_id, pet_tag, name, species, breed, birth_date, weight, sex, created_at, updated_at, owners(full_name)';

const getOwnerName = (owners: PetRow['owners']): string =>
  Array.isArray(owners)
    ? (owners[0]?.full_name ?? 'Propietario sin nombre')
    : (owners?.full_name ?? 'Propietario sin nombre');

const toPet = (row: PetRow): Pet => ({
  id: row.id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  ownerId: row.owner_id,
  ownerName: getOwnerName(row.owners),
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
  private static async uploadPhoto(photoDataUrl: string): Promise<string> {
    const commaIndex = photoDataUrl.indexOf(',');
    if (!photoDataUrl.startsWith('data:image/') || commaIndex < 0) {
      throw new Error('PET_PHOTO_INVALID_TYPE');
    }
    const base64 = photoDataUrl.slice(commaIndex + 1).replace(/\s/g, '');
    if (!base64 || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
      throw new Error('PET_PHOTO_INVALID_TYPE');
    }
    let bytes: Buffer;
    try {
      bytes = Buffer.from(base64, 'base64');
    } catch {
      throw new Error('PET_PHOTO_INVALID_TYPE');
    }
    if (bytes.length > 5 * 1024 * 1024) throw new Error('PET_PHOTO_TOO_LARGE');
    const isPng =
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a;
    const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isWebp =
      bytes.length >= 12 &&
      bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
      bytes.subarray(8, 12).toString('ascii') === 'WEBP';
    if (!isPng && !isJpeg && !isWebp) throw new Error('PET_PHOTO_INVALID_TYPE');
    const contentType = isPng ? 'image/png' : isJpeg ? 'image/jpeg' : 'image/webp';
    const extension = contentType === 'image/jpeg' ? 'jpg' : contentType === 'image/png' ? 'png' : 'webp';
    const path = `pets/${randomUUID()}.${extension}`;
    const supabase = getSupabaseClient();
    const { error } = await supabase.storage.from('pet-images').upload(path, new Uint8Array(bytes), {
      contentType,
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw new Error(`PET_PHOTO_UPLOAD_FAILED: ${error.message}`);
    return supabase.storage.from('pet-images').getPublicUrl(path).data.publicUrl;
  }

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
    const photoUrl = input.photoDataUrl
      ? await PetService.uploadPhoto(input.photoDataUrl)
      : input.photoUrl?.trim() || null;
    const values = {
      owner_id: input.ownerId,
      pet_tag: input.petTag.trim(),
      name: input.name.trim(),
      species: input.species.trim(),
      breed: input.breed?.trim() || null,
      birth_date: input.birthDate || null,
      weight: input.weight ?? null,
      sex: input.sex ?? null,
      photo_url: photoUrl,
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
    if (input.photoDataUrl) values.photo_url = await PetService.uploadPhoto(input.photoDataUrl);
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
