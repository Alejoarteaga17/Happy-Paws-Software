import { Vaccination } from '../types/vaccination';
import { getSupabaseClient, isSupabaseConfigured } from './supabase-client';

export interface CreateVaccinationInput {
  petId: number;
  vaccineName: string;
  administeredAt: string;
  nextDueDate: string;
}

export async function getVaccinations(): Promise<Vaccination[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is required');
  const normalizedApiUrl = apiUrl.trim().replace(/\/$/, '');
  if (!URL.canParse(normalizedApiUrl)) throw new Error('NEXT_PUBLIC_API_URL no es una URL válida');

  const headers: HeadersInit = {};
  if (isSupabaseConfigured) {
    const { data: sessionData, error: sessionError } = await getSupabaseClient().auth.getSession();
    if (sessionError) throw new Error(`Supabase session failed: ${sessionError.message}`);
    if (sessionData.session) headers.Authorization = `Bearer ${sessionData.session.access_token}`;
  }

  const response = await fetch(`${normalizedApiUrl}/api/v1/vaccinations`, {
    cache: 'no-store',
    headers
  });
  const payload = (await response.json()) as {
    success: boolean;
    data: Vaccination[] | null;
    error: { message?: string } | null;
  };

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? 'No se pudieron cargar las vacunaciones');
  }

  return payload.data;
}

export async function createVaccination(input: CreateVaccinationInput): Promise<Vaccination> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is required');
  const normalizedApiUrl = apiUrl.trim().replace(/\/$/, '');
  if (!URL.canParse(normalizedApiUrl)) throw new Error('NEXT_PUBLIC_API_URL no es una URL válida');
  if (!isSupabaseConfigured) throw new Error('Configura Supabase e inicia sesión para registrar una vacuna');

  const { data: sessionData, error: sessionError } = await getSupabaseClient().auth.getSession();
  if (sessionError) throw new Error(`Supabase session failed: ${sessionError.message}`);
  if (!sessionData.session) throw new Error('Debes iniciar sesión para registrar una vacuna');

  const response = await fetch(`${normalizedApiUrl}/api/v1/vaccinations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionData.session.access_token}`
    },
    body: JSON.stringify(input)
  });
  const payload = (await response.json()) as {
    success: boolean;
    data: Vaccination | null;
    error: { message?: string } | null;
  };

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? 'No se pudo registrar la vacunación');
  }

  return payload.data;
}