import { getSupabaseClient, isSupabaseConfigured } from './supabase-client';
import { CreatePetInput, Pet, UpdatePetInput } from '../types/pet';

interface ApiError {
  code?: string;
  message?: string;
}

const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  if (!apiUrl || !URL.canParse(apiUrl)) throw new Error('NEXT_PUBLIC_API_URL no es una URL válida');
  return `${apiUrl}/api/v1/pets`;
};

const getHeaders = async (): Promise<HeadersInit> => {
  if (!isSupabaseConfigured) throw new Error('Configura Supabase e inicia sesión para gestionar mascotas');
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw new Error(`Supabase session failed: ${error.message}`);
  if (!data.session) throw new Error('Debes iniciar sesión para gestionar mascotas');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` };
};

const request = async <T>(init?: RequestInit): Promise<T> => {
  const response = await fetch(getApiUrl(), {
    cache: 'no-store',
    ...init,
    headers: { ...(await getHeaders()), ...init?.headers },
  });
  const payload = (await response.json()) as { success: boolean; data: T | null; error: ApiError | null };
  if (!response.ok || !payload.success || payload.data === null) {
    throw new Error(
      payload.error?.code === 'PET_TAG_ALREADY_EXISTS'
        ? 'El pet_tag ya está registrado.'
        : (payload.error?.message ?? 'No se pudo completar la operación'),
    );
  }
  return payload.data;
};

export const getPets = (): Promise<Pet[]> => request<Pet[]>();
export const createPet = (input: CreatePetInput): Promise<Pet> =>
  request<Pet>({ method: 'POST', body: JSON.stringify(input) });
export const updatePet = (id: number, input: UpdatePetInput): Promise<Pet> =>
  request<Pet>({ method: 'PUT', body: JSON.stringify(input) });
export const deletePet = async (id: number): Promise<Pet> => {
  const response = await fetch(`${getApiUrl()}/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
    headers: await getHeaders(),
  });
  const payload = (await response.json()) as { success: boolean; data: Pet | null; error: ApiError | null };
  if (!response.ok || !payload.success || payload.data === null)
    throw new Error(payload.error?.message ?? 'No se pudo eliminar');
  return payload.data;
};
