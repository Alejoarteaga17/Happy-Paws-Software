import { UserRole } from '../context/auth-context';
import { getSupabaseClient, isSupabaseConfigured } from './supabase-client';

export interface UserRow {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  active: boolean;
}

export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  ownerId: number | null;
}

interface ApiError {
  message?: string;
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  if (!baseUrl || !URL.canParse(baseUrl)) throw new Error('NEXT_PUBLIC_API_URL no es una URL válida');
  if (!isSupabaseConfigured) throw new Error('Configura Supabase e inicia sesión para administrar usuarios');
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw new Error(`Supabase session failed: ${error.message}`);
  if (!data.session) throw new Error('Debes iniciar sesión para administrar usuarios');

  const response = await fetch(`${baseUrl}/api/v1/users${path}`, {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.session.access_token}`,
      ...init?.headers,
    },
  });
  const payload = (await response.json()) as { success: boolean; data: T | null; error: ApiError | null };
  if (!response.ok || !payload.success || payload.data === null) {
    throw new Error(payload.error?.message ?? 'No se pudo completar la operación');
  }
  return payload.data;
};

export const getUsers = (): Promise<UserRow[]> => request<UserRow[]>('');
export const createUser = (input: CreateUserInput): Promise<UserRow> =>
  request<UserRow>('', { method: 'POST', body: JSON.stringify(input) });
export const updateUserRole = (id: string, role: UserRole): Promise<UserRow> =>
  request<UserRow>(`/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
export const updateUserStatus = (id: string, active: boolean): Promise<{ id: string; active: boolean }> =>
  request<{ id: string; active: boolean }>(`/${id}/status`, { method: 'PATCH', body: JSON.stringify({ active }) });
