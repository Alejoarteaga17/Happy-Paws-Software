import { getSupabaseClient } from '../config/supabase';

export interface OwnerInput {
  fullName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  authUserId?: string | null;
}

interface OwnerRow {
  id: number;
  auth_user_id?: string | null;
  full_name?: string;
  phone?: string;
  email?: string | null;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
}

const toOwner = (row: OwnerRow) => ({
  id: row.id,
  ...(row.full_name !== undefined ? { fullName: row.full_name } : {}),
  ...(row.phone !== undefined ? { phone: row.phone } : {}),
  ...(row.email !== undefined ? { email: row.email } : {}),
  ...(row.address !== undefined ? { address: row.address } : {}),
  ...(row.auth_user_id !== undefined ? { authUserId: row.auth_user_id } : {}),
  ...(row.updated_at !== undefined ? { updatedAt: row.updated_at } : {}),
});

export class OwnerService {
  static async list() {
    const { data, error } = await getSupabaseClient()
      .from('owners')
      .select('id, auth_user_id, full_name, phone, email, address, created_at, updated_at')
      .is('deleted_at', null)
      .order('full_name');
    if (error) throw new Error(`OWNERS_LIST_FAILED: ${error.message}`);
    return (data ?? []).map(toOwner);
  }

  static async getById(id: number) {
    const { data, error } = await getSupabaseClient()
      .from('owners')
      .select('id, auth_user_id, full_name, phone, email, address, created_at, updated_at')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw new Error(`OWNER_LOOKUP_FAILED: ${error.message}`);
    if (!data) throw new Error('OWNER_NOT_FOUND');
    return toOwner(data);
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
      .select('id, auth_user_id, full_name, phone, email, address, created_at, updated_at')
      .single();
    if (error || !data) throw new Error(error?.code === '23505' ? 'OWNER_ALREADY_LINKED' : 'OWNER_CREATE_FAILED');
    return toOwner(data);
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
      .is('deleted_at', null)
      .select('id, auth_user_id, full_name, phone, email, address, created_at, updated_at')
      .maybeSingle();
    if (error) throw new Error(`OWNER_UPDATE_FAILED: ${error.message}`);
    if (!data) throw new Error('OWNER_NOT_FOUND');
    return toOwner(data);
  }

  static async setActive(id: number, active: boolean) {
    const { data, error } = await getSupabaseClient()
      .from('owners')
      .update({ deleted_at: active ? null : new Date().toISOString() })
      .eq('id', id)
      .select('id, auth_user_id, full_name, phone, email, address, created_at, updated_at')
      .maybeSingle();
    if (error) throw new Error(`OWNER_STATUS_UPDATE_FAILED: ${error.message}`);
    if (!data) throw new Error('OWNER_NOT_FOUND');
    return toOwner(data);
  }

  static async delete(id: number) {
    const supabase = getSupabaseClient();
    const { data: owner, error: ownerLookupError } = await supabase
      .from('owners')
      .select('id, auth_user_id, full_name')
      .eq('id', id)
      .maybeSingle();
    if (ownerLookupError) throw new Error(`OWNER_DELETE_FAILED: ${ownerLookupError.message}`);
    if (!owner) throw new Error('OWNER_NOT_FOUND');

    const { count, error: petCountError } = await supabase
      .from('pets')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', id);
    if (petCountError) throw new Error(`OWNER_DELETE_FAILED: ${petCountError.message}`);

    const { error: petDeleteError } = await supabase.from('pets').delete().eq('owner_id', id);
    if (petDeleteError) throw new Error(`OWNER_DELETE_FAILED: ${petDeleteError.message}`);

    const { data: deletedOwner, error: ownerDeleteError } = await supabase
      .from('owners')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();
    if (ownerDeleteError) throw new Error(`OWNER_DELETE_FAILED: ${ownerDeleteError.message}`);
    if (!deletedOwner) throw new Error('OWNER_NOT_FOUND');

    if (owner.auth_user_id) {
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(owner.auth_user_id);
      if (authDeleteError) console.error('Linked owner auth account deletion failed:', authDeleteError.message);
    }

    return { id, fullName: owner.full_name as string, deletedPets: count ?? 0 };
  }
}
