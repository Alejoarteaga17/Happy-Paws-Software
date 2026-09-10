import { getSupabaseClient, isSupabaseConfigured } from './supabase-client';
import { Owner } from '../types/owner';

interface OwnerRow {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
}

export async function getOwners(): Promise<Owner[]> {
  if (!isSupabaseConfigured) throw new Error('Configura Supabase e inicia sesión para consultar propietarios');

  const { data, error } = await getSupabaseClient()
    .from('owners')
    .select('id, full_name, phone, email')
    .order('full_name', { ascending: true });

  if (error) throw new Error(`No se pudieron cargar los propietarios: ${error.message}`);

  const owners: OwnerRow[] = data ?? [];
  return owners.map((owner) => ({
    id: Number(owner.id),
    fullName: owner.full_name,
    phone: owner.phone,
    email: owner.email
  }));
}
