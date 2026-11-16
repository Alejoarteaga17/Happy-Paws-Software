import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getSupabaseClient } from '../src/config/supabase';
import { UserService } from '../src/services/user.service';

jest.mock('../src/config/supabase', () => ({ getSupabaseClient: jest.fn() }));

const mockedGetSupabaseClient = jest.mocked(getSupabaseClient);

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists profiles with the active state from Supabase Auth', async () => {
    const order = jest.fn(async () => ({
      data: [{ id: 'user-1', email: 'ana@example.com', role: 'OWNER' }],
      error: null,
    }));
    const client = {
      from: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ order }) }),
      auth: {
        admin: {
          listUsers: jest.fn(async () => ({
            data: { users: [{ id: 'user-1', banned_until: null }] },
            error: null,
          })),
        },
      },
    };
    mockedGetSupabaseClient.mockReturnValue(client as never);

    await expect(UserService.list()).resolves.toEqual([
      { id: 'user-1', email: 'ana@example.com', role: 'OWNER', active: true },
    ]);
  });

  it('creates and links an OWNER account atomically', async () => {
    const single = jest.fn(async () => ({
      data: { id: 'user-1', email: 'ana@example.com', role: 'OWNER' },
      error: null,
    }));
    const profileUpdate = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single }) }),
    });
    const ownerUpdate = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        is: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({ maybeSingle: async () => ({ data: { id: 3 }, error: null }) }),
        }),
      }),
    });
    const client = {
      from: jest.fn((table: string) => (table === 'profiles' ? { update: profileUpdate } : { update: ownerUpdate })),
      auth: {
        admin: {
          createUser: jest.fn(async () => ({ data: { user: { id: 'user-1' } }, error: null })),
          deleteUser: jest.fn(),
        },
      },
    };
    mockedGetSupabaseClient.mockReturnValue(client as never);

    await expect(
      UserService.create({
        email: 'ana@example.com',
        password: 'Strong123',
        fullName: 'Ana',
        role: 'OWNER',
        ownerId: 3,
      }),
    ).resolves.toMatchObject({ id: 'user-1', active: true });
    expect(ownerUpdate).toHaveBeenCalledWith({ auth_user_id: 'user-1' });
  });

  it('deactivates an account through Supabase Auth instead of exposing admin credentials', async () => {
    const updateUserById = jest.fn(async (..._args: unknown[]) => ({ data: { user: { id: 'user-1' } }, error: null }));
    mockedGetSupabaseClient.mockReturnValue({ auth: { admin: { updateUserById } } } as never);

    await expect(UserService.updateStatus('user-1', false)).resolves.toEqual({ id: 'user-1', active: false });
    expect(updateUserById).toHaveBeenCalledWith('user-1', { ban_duration: '876000h' });
  });
});
