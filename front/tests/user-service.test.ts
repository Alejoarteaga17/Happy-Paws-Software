import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createUser, getUsers, updateUserRole, updateUserStatus } from '../src/services/user-service';

vi.mock('../src/services/supabase-client', () => ({
  isSupabaseConfigured: true,
  getSupabaseClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'admin-token' } }, error: null }),
    },
  }),
}));

describe('user service', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4000');
    vi.restoreAllMocks();
  });

  it('uses the protected administration endpoints for user lifecycle actions', async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify({ success: true, data: { id: 'user-1' }, error: null }))),
      );
    vi.stubGlobal('fetch', fetchMock);

    await getUsers();
    await createUser({ email: 'owner@example.com', password: 'Strong123', fullName: 'Ana', role: 'OWNER', ownerId: 1 });
    await updateUserRole('user-1', 'VET');
    await updateUserStatus('user-1', false);

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:4000/api/v1/users',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      'http://localhost:4000/api/v1/users/user-1/role',
      expect.objectContaining({ method: 'PATCH' }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      4,
      'http://localhost:4000/api/v1/users/user-1/status',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('surfaces failed administration requests', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false, data: null, error: { message: 'Forbidden' } }), {
          status: 403,
        }),
      ),
    );

    await expect(getUsers()).rejects.toThrow('Forbidden');
  });
});
