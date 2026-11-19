import { getSupabaseClient } from '../config/supabase';
import { AppRole } from '../types/auth';

export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  role: AppRole;
  ownerId?: number | null;
}

export class UserService {
  static async list() {
    const client = getSupabaseClient();
    const [{ data, error }, authUsers] = await Promise.all([
      client.from('profiles').select('id, email, full_name, role, created_at').order('created_at'),
      client.auth.admin.listUsers({ perPage: 1000 }),
    ]);
    if (error) throw new Error(`USERS_LIST_FAILED: ${error.message}`);
    if (authUsers.error) throw new Error(`USERS_LIST_FAILED: ${authUsers.error.message}`);
    const statusById = new Map(
      authUsers.data.users.map((user) => [user.id, !user.banned_until || new Date(user.banned_until) <= new Date()]),
    );
    return (data ?? []).map((profile) => ({ ...profile, active: statusById.get(profile.id) ?? false }));
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

  static async create(input: CreateUserInput) {
    const client = getSupabaseClient();
    const { data: authData, error: authError } = await client.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: { full_name: input.fullName },
    });
    if (authError || !authData.user)
      throw new Error(`USER_CREATE_FAILED: ${authError?.message ?? 'No se creó la cuenta.'}`);

    try {
      const { data: profile, error: profileError } = await client
        .from('profiles')
        .update({ email: input.email, full_name: input.fullName, role: input.role })
        .eq('id', authData.user.id)
        .select('id, email, full_name, role, created_at')
        .single();
      if (profileError || !profile)
        throw new Error(`USER_CREATE_FAILED: ${profileError?.message ?? 'No se creó el perfil.'}`);

      if (input.role === 'OWNER') {
        if (input.ownerId === null || input.ownerId === undefined) throw new Error('OWNER_ID_REQUIRED');
        const { data: owner, error: ownerError } = await client
          .from('owners')
          .update({ auth_user_id: authData.user.id })
          .eq('id', input.ownerId)
          .is('auth_user_id', null)
          .select('id')
          .maybeSingle();
        if (ownerError || !owner) throw new Error('OWNER_NOT_FOUND_OR_ALREADY_LINKED');
      }

      return { ...profile, active: true };
    } catch (error) {
      await client.auth.admin.deleteUser(authData.user.id);
      throw error;
    }
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

  static async updateStatus(id: string, active: boolean) {
    const { data, error } = await getSupabaseClient().auth.admin.updateUserById(id, {
      ban_duration: active ? 'none' : '876000h',
    });
    if (error || !data.user)
      throw new Error(`USER_STATUS_UPDATE_FAILED: ${error?.message ?? 'No se actualizó el estado.'}`);
    return { id, active };
  }
}
