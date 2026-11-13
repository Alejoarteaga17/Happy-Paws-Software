import { getSupabaseClient, isSupabaseConfigured } from './supabase-client';
import { ClinicalNote, ClinicalNoteInput } from '../types/clinical-note';

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  if (!baseUrl || !URL.canParse(baseUrl)) throw new Error('NEXT_PUBLIC_API_URL no es una URL válida');
  if (!isSupabaseConfigured) throw new Error('Configura Supabase para consultar notas clínicas');
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw new Error(`Supabase session failed: ${error.message}`);
  if (!data.session) throw new Error('Debes iniciar sesión');
  const response = await fetch(`${baseUrl}/api/v1/clinical-notes${path}`, {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.session.access_token}`,
      ...init?.headers,
    },
  });
  const payload = (await response.json()) as { success: boolean; data: T | null; error: { message?: string } | null };
  if (!response.ok || !payload.success || payload.data === null) {
    throw new Error(payload.error?.message ?? 'No se pudo completar la operación');
  }
  return payload.data;
};

export const getClinicalNotes = (): Promise<ClinicalNote[]> => request<ClinicalNote[]>('');
export const createClinicalNote = (input: ClinicalNoteInput): Promise<ClinicalNote> =>
  request<ClinicalNote>('', { method: 'POST', body: JSON.stringify(input) });
