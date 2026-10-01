import { getSupabaseClient } from '../config/supabase';

export interface OwnerInput {
  fullName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  authUserId?: string | null;
}

export class OwnerService {
  static async list() {
    const { data, error } = await getSupabaseClient()
      .from('owners')
      .select('id, auth_user_id, full_name, phone, email, address, created_at')
      .order('full_name');
    if (error) throw new Error(`OWNERS_LIST_FAILED: ${error.message}`);
    return data ?? [];
  }

  static async getById(id: number) {
    const { data, error } = await getSupabaseClient()
      .from('owners')
      .select('id, auth_user_id, full_name, phone, email, address, created_at')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(`OWNER_LOOKUP_FAILED: ${error.message}`);
    if (!data) throw new Error('OWNER_NOT_FOUND');
    return data;
  }

  static async create(input: OwnerInput) {
    const { data, error } = await getSupabaseClient()
      .from('owners')
      .insert({
        full_name: input.fullName.trim(),
        phone: input.phone.trim(),
        email: input.email?.trim() || null,
        address: input.address?.trim() || null,
        auth_user_id: input.authUserId || null,
      })
      .select('id, auth_user_id, full_name, phone, email, address, created_at')
      .single();
    if (error || !data) throw new Error(error?.code === '23505' ? 'OWNER_ALREADY_LINKED' : 'OWNER_CREATE_FAILED');
    return data;
  }

  static async update(id: number, input: Partial<OwnerInput>) {
    const values: Record<string, string | null> = {};
    if (input.fullName !== undefined) values.full_name = input.fullName.trim();
    if (input.phone !== undefined) values.phone = input.phone.trim();
    if (input.email !== undefined) values.email = input.email?.trim() || null;
    if (input.address !== undefined) values.address = input.address?.trim() || null;
    if (input.authUserId !== undefined) values.auth_user_id = input.authUserId || null;
    const { data, error } = await getSupabaseClient()
      .from('owners')
      .update(values)
      .eq('id', id)
      .select('id, auth_user_id, full_name, phone, email, address, created_at')
      .maybeSingle();
    if (error) throw new Error(`OWNER_UPDATE_FAILED: ${error.message}`);
    if (!data) throw new Error('OWNER_NOT_FOUND');
    return data;
  }
}
