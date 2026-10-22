import { getSupabaseClient, isSupabaseConfigured } from './supabase-client';
import { Owner, OwnerInput } from '../types/owner';

interface ApiError {
  code?: string;
  message?: string;
}

const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  if (!apiUrl || !URL.canParse(apiUrl)) throw new Error('NEXT_PUBLIC_API_URL no es una URL válida');
  return `${apiUrl}/api/v1/owners`;
};

const getHeaders = async (): Promise<HeadersInit> => {
  if (!isSupabaseConfigured) throw new Error('Configura Supabase e inicia sesión para gestionar propietarios');
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw new Error(`Supabase session failed: ${error.message}`);
  if (!data.session) throw new Error('Debes iniciar sesión para gestionar propietarios');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` };
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${getApiUrl()}${path}`, {
    cache: 'no-store',
    ...init,
    headers: { ...(await getHeaders()), ...init?.headers },
  });
  const payload = (await response.json()) as { success: boolean; data: T | null; error: ApiError | null };
  if (!response.ok || !payload.success || payload.data === null) {
    throw new Error(payload.error?.message ?? 'No se pudo completar la operación');
  }
  return payload.data;
};

export const getOwners = (): Promise<Owner[]> => request<Owner[]>('');
export const createOwner = (input: OwnerInput): Promise<Owner> =>
  request<Owner>('', { method: 'POST', body: JSON.stringify(input) });
export const updateOwner = (id: number, input: Partial<OwnerInput>): Promise<Owner> =>
  request<Owner>(`/${id}`, { method: 'PUT', body: JSON.stringify(input) });
export const deleteOwner = (id: number): Promise<Owner> => request<Owner>(`/${id}`, { method: 'DELETE' });
