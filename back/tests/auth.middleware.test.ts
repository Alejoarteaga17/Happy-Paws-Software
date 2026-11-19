import { describe, expect, it, jest } from '@jest/globals';
import { getSupabaseClient } from '../src/config/supabase';
import { requireAuth, requireOwner, requireRoles } from '../src/middlewares/auth.middleware';

jest.mock('../src/config/supabase', () => ({ getSupabaseClient: jest.fn() }));

const mockedGetSupabaseClient = jest.mocked(getSupabaseClient);

const response = () => {
  const result = { statusCode: 200, body: undefined as unknown };
  const responseMock = {
    status: jest.fn((statusCode: number) => {
      result.statusCode = statusCode;
      return responseMock;
    }),
    json: jest.fn((body: unknown) => {
      result.body = body;
      return responseMock;
    }),
  };
  return { responseMock, result };
};

describe('authorization middleware', () => {
  it('rejects requests without a bearer token', async () => {
    const next = jest.fn();
    const { responseMock, result } = response();
    const request = { header: jest.fn().mockReturnValue(undefined) };

    await requireAuth(request as never, responseMock as never, next);

    expect(result.statusCode).toBe(401);
    expect(result.body).toMatchObject({ error: { code: 'UNAUTHORIZED' } });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects invalid bearer tokens', async () => {
    const next = jest.fn();
    const { responseMock, result } = response();
    const request = { header: jest.fn().mockReturnValue('Bearer invalid-token') };
    mockedGetSupabaseClient.mockReturnValue({
      auth: {
        getUser: jest.fn(async (..._args: unknown[]) => ({ data: { user: null }, error: new Error('invalid') })),
      },
    } as never);

    await requireAuth(request as never, responseMock as never, next);

    expect(result.statusCode).toBe(401);
    expect(result.body).toMatchObject({ error: { code: 'INVALID_TOKEN' } });
  });

  it('rejects users without a profile', async () => {
    const next = jest.fn();
    const { responseMock, result } = response();
    const request = { header: jest.fn().mockReturnValue('Bearer valid-token') };
    const maybeSingle = jest.fn(async (..._args: unknown[]) => ({ data: null, error: null }));
    mockedGetSupabaseClient.mockReturnValue({
      auth: { getUser: jest.fn(async (..._args: unknown[]) => ({ data: { user: { id: 'user-1' } }, error: null })) },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ maybeSingle }) }),
      }),
    } as never);

    await requireAuth(request as never, responseMock as never, next);

    expect(result.statusCode).toBe(401);
    expect(result.body).toMatchObject({ error: { code: 'PROFILE_NOT_FOUND' } });
  });

  it('rejects when the owner context lookup fails', async () => {
    const next = jest.fn();
    const { responseMock, result } = response();
    const request = { header: jest.fn().mockReturnValue('Bearer valid-token') };
    const profileQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(async (..._args: unknown[]) => ({
        data: { id: 'user-1', email: 'vet@example.com', role: 'VET' },
        error: null,
      })),
    };
    const ownerQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(async (..._args: unknown[]) => ({ data: null, error: new Error('database unavailable') })),
    };
    mockedGetSupabaseClient.mockReturnValue({
      auth: { getUser: jest.fn(async (..._args: unknown[]) => ({ data: { user: { id: 'user-1' } }, error: null })) },
      from: jest.fn((table: string) => (table === 'profiles' ? profileQuery : ownerQuery)),
    } as never);

    await requireAuth(request as never, responseMock as never, next);

    expect(result.statusCode).toBe(500);
    expect(result.body).toMatchObject({ error: { code: 'AUTH_CONTEXT_FAILED' } });
  });

  it('attaches the profile and linked owner context to authenticated requests', async () => {
    const next = jest.fn();
    const { responseMock, result } = response();
    const request = { header: jest.fn().mockReturnValue('Bearer valid-token') };
    const profileQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(async (..._args: unknown[]) => ({
        data: { id: 'user-1', email: null, role: 'OWNER' },
        error: null,
      })),
    };
    const ownerQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(async (..._args: unknown[]) => ({ data: { id: 8 }, error: null })),
    };
    mockedGetSupabaseClient.mockReturnValue({
      auth: {
        getUser: jest.fn(async (..._args: unknown[]) => ({
          data: { user: { id: 'user-1', email: 'owner@example.com' } },
          error: null,
        })),
      },
      from: jest.fn((table: string) => (table === 'profiles' ? profileQuery : ownerQuery)),
    } as never);

    await requireAuth(request as never, responseMock as never, next);

    expect(result.statusCode).toBe(200);
    expect(request).toMatchObject({
      user: { id: 'user-1', email: 'owner@example.com', role: 'OWNER', ownerId: 8 },
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('rejects requests without an authenticated context', () => {
    const next = jest.fn();
    const { responseMock, result } = response();

    requireRoles('ADMIN')({} as never, responseMock as never, next);

    expect(result.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('enforces the caller role', () => {
    const next = jest.fn();
    const { responseMock, result } = response();

    requireRoles('ADMIN')(
      { user: { id: 'owner-1', email: 'owner@example.com', role: 'OWNER', ownerId: 1 } } as never,
      responseMock as never,
      next,
    );

    expect(result.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('requires an owner resource context for the portal', () => {
    const next = jest.fn();
    const { responseMock, result } = response();

    requireOwner(
      { user: { id: 'staff-1', email: 'vet@example.com', role: 'VET', ownerId: null } } as never,
      responseMock as never,
      next,
    );

    expect(result.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows an authenticated owner with a linked owner record', () => {
    const next = jest.fn();
    const { responseMock, result } = response();

    requireOwner(
      { user: { id: 'owner-1', email: 'owner@example.com', role: 'OWNER', ownerId: 7 } } as never,
      responseMock as never,
      next,
    );

    expect(result.statusCode).toBe(200);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('allows every configured staff role for a staff-only route', () => {
    (['ADMIN', 'VET', 'RECEPTIONIST'] as const).forEach((role) => {
      const next = jest.fn();
      const { responseMock, result } = response();

      requireRoles('ADMIN', 'VET', 'RECEPTIONIST')(
        { user: { id: `${role}-1`, email: `${role.toLowerCase()}@example.com`, role, ownerId: null } } as never,
        responseMock as never,
        next,
      );

      expect(result.statusCode).toBe(200);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
