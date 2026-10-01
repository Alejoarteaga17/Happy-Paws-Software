import { describe, expect, it, jest } from '@jest/globals';
import { requireOwner, requireRoles } from '../src/middlewares/auth.middleware';

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
});
