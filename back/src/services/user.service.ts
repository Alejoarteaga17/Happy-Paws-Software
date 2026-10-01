import { getSupabaseClient } from '../config/supabase';
import { AppRole } from '../types/auth';

export class UserService {
  static async list() {
    const { data, error } = await getSupabaseClient()
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .order('created_at');
    if (error) throw new Error(`USERS_LIST_FAILED: ${error.message}`);
    return data ?? [];
  }

  static async getById(id: string) {
    const { data, error } = await getSupabaseClient()
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(`USER_LOOKUP_FAILED: ${error.message}`);
    if (!data) throw new Error('USER_NOT_FOUND');
    return data;
  }

  static async updateRole(id: string, role: AppRole) {
    const { data, error } = await getSupabaseClient()
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select('id, email, full_name, role, created_at')
      .maybeSingle();
    if (error) throw new Error(`USER_ROLE_UPDATE_FAILED: ${error.message}`);
    if (!data) throw new Error('USER_NOT_FOUND');
    return data;
  }
}
