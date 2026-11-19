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

interface OwnerApiRow {
  id: number;
  auth_user_id?: string | null;
  authUserId?: string | null;
  full_name?: string;
  fullName?: string;
  phone?: string;
  email?: string | null;
  address?: string | null;
  updated_at?: string;
  updatedAt?: string;
}

const normalizeOwner = (row: OwnerApiRow): Owner => ({
  id: row.id,
  fullName: row.fullName ?? row.full_name ?? '',
  phone: row.phone ?? '',
  email: row.email ?? null,
  address: row.address ?? null,
  updatedAt: row.updatedAt ?? row.updated_at ?? '',
  authUserId: row.authUserId ?? row.auth_user_id ?? null,
});

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

export const getOwners = async (): Promise<Owner[]> => (await request<OwnerApiRow[]>('')).map(normalizeOwner);
export const createOwner = (input: OwnerInput): Promise<Owner> =>
  request<Owner>('', { method: 'POST', body: JSON.stringify(input) });
export const updateOwner = (id: number, input: Partial<OwnerInput>): Promise<Owner> =>
  request<Owner>(`/${id}`, { method: 'PUT', body: JSON.stringify(input) });
export const updateOwnerStatus = (id: number, active: boolean): Promise<Owner> =>
  request<Owner>(`/${id}/status`, { method: 'PATCH', body: JSON.stringify({ active }) });
export const deleteOwner = (id: number): Promise<{ id: number; fullName: string; deletedPets: number }> =>
  request<{ id: number; fullName: string; deletedPets: number }>(`/${id}`, { method: 'DELETE' });
