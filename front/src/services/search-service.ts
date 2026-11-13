import { getSupabaseClient, isSupabaseConfigured } from './supabase-client';
import { SearchResult } from '../types/search';

export async function searchRecords(query: string): Promise<SearchResult[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  if (!baseUrl || !URL.canParse(baseUrl)) throw new Error('NEXT_PUBLIC_API_URL no es una URL válida');
  if (!isSupabaseConfigured) throw new Error('Configura Supabase para buscar registros');
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw new Error(`Supabase session failed: ${error.message}`);
  if (!data.session) throw new Error('Debes iniciar sesión para buscar');
  const response = await fetch(`${baseUrl}/api/v1/search?q=${encodeURIComponent(query)}`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${data.session.access_token}` },
  });
  const payload = (await response.json()) as {
    success: boolean;
    data: SearchResult[] | null;
    error: { message?: string } | null;
  };
  if (!response.ok || !payload.success || payload.data === null) {
    throw new Error(payload.error?.message ?? 'No se pudo completar la búsqueda');
  }
  return payload.data;
}
