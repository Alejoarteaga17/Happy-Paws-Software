import { getSupabaseClient, isSupabaseConfigured } from './supabase-client';
import { Appointment, AppointmentInput } from '../types/appointment';

const getHeaders = async (): Promise<HeadersInit> => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (isSupabaseConfigured) {
    const { data, error } = await getSupabaseClient().auth.getSession();
    if (error) throw new Error(`Supabase session failed: ${error.message}`);
    if (data.session) headers.Authorization = `Bearer ${data.session.access_token}`;
  }
  return headers;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is required');
  const response = await fetch(`${apiUrl}/api/v1/appointments${path}`, { cache: 'no-store', ...init, headers: { ...(await getHeaders()), ...init?.headers } });
  const payload = (await response.json()) as { success: boolean; data: T | null; error: { message?: string } | null };
  if (!response.ok || !payload.success || payload.data === null) throw new Error(payload.error?.message ?? 'No se pudo completar la operación');
  return payload.data;
};

export const getAppointments = (): Promise<Appointment[]> => request<Appointment[]>('');
export const createAppointment = (input: AppointmentInput): Promise<Appointment> => request<Appointment>('', { method: 'POST', body: JSON.stringify(input) });
export const updateAppointment = (id: number, input: Partial<AppointmentInput>): Promise<Appointment> => request<Appointment>(`/${id}`, { method: 'PUT', body: JSON.stringify(input) });
export const cancelAppointment = (id: number): Promise<Appointment> => request<Appointment>(`/${id}/cancel`, { method: 'PATCH' });