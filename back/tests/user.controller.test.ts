import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AuditService } from '../src/services/audit.service';
import { UserService } from '../src/services/user.service';
import { createUser, getUser, listUsers, updateUserRole, updateUserStatus } from '../src/controllers/user.controller';

jest.mock('../src/services/audit.service', () => ({ AuditService: { record: jest.fn() } }));
jest.mock('../src/services/user.service', () => ({
  UserService: {
    create: jest.fn(),
    list: jest.fn(),
    getById: jest.fn(),
    updateRole: jest.fn(),
    updateStatus: jest.fn(),
  },
}));

const mockedUpdateRole = jest.mocked(UserService.updateRole);
const mockedCreate = jest.mocked(UserService.create);
const mockedList = jest.mocked(UserService.list);
const mockedGet = jest.mocked(UserService.getById);
const mockedStatus = jest.mocked(UserService.updateStatus);

const response = () => {
  const result = { statusCode: 200, body: undefined as unknown };
  const mock = {
    status: jest.fn((statusCode: number) => {
      result.statusCode = statusCode;
      return mock;
    }),
    json: jest.fn((body: unknown) => {
      result.body = body;
      return mock;
    }),
  };
  return { mock, result };
};

describe('updateUserRole controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('validates create payload and receptionist ADMIN restriction', async () => {
    const { mock, result } = response();
    await createUser(
      {
        body: { email: 'a@b.com', password: 'Strong123', fullName: 'Ana', role: 'ADMIN' },
        user: { role: 'RECEPTIONIST', id: 'r1' },
      } as never,
      mock as never,
    );
    expect(result.statusCode).toBe(403);
  });

  it('creates a valid internal account and audits it', async () => {
    mockedCreate.mockResolvedValue({ id: 'u2' } as never);
    const { mock, result } = response();
    await createUser(
      {
        body: { email: 'vet@b.com', password: 'Strong123', fullName: 'Vet', role: 'VET' },
        user: { role: 'ADMIN', id: 'a1' },
      } as never,
      mock as never,
    );
    expect(result.statusCode).toBe(201);
    expect(AuditService.record).toHaveBeenCalled();
  });

  it('lists and gets users', async () => {
    mockedList.mockResolvedValue([{ id: 'u1' }] as never);
    mockedGet.mockResolvedValue({ id: 'u1' } as never);
    const list = response();
    await listUsers({} as never, list.mock as never);
    expect(list.result.statusCode).toBe(200);

    const get = response();
    await getUser({ params: { id: 'u1' } } as never, get.mock as never);
    expect(get.result.statusCode).toBe(200);
  });

  it('rejects invalid role updates', async () => {
    const { mock, result } = response();
    await updateUserRole(
      { params: { id: 'u2' }, body: { role: 'INVALID' }, user: { role: 'ADMIN', id: 'a1' } } as never,
      mock as never,
    );
    expect(result.statusCode).toBe(400);
  });

  it('updates role as ADMIN', async () => {
    mockedUpdateRole.mockResolvedValue({ id: 'u2', role: 'VET' } as never);
    const { mock, result } = response();
    await updateUserRole(
      { params: { id: 'u2' }, body: { role: 'VET' }, user: { role: 'ADMIN', id: 'a1' } } as never,
      mock as never,
    );
    expect(result.statusCode).toBe(200);
  });

  it('validates and updates account status', async () => {
    const invalid = response();
    await updateUserStatus({ params: { id: 'u2' }, body: {} } as never, invalid.mock as never);
    expect(invalid.result.statusCode).toBe(400);

    mockedStatus.mockResolvedValue({ id: 'u2', active: false } as never);
    const valid = response();
    await updateUserStatus(
      { params: { id: 'u2' }, body: { active: false }, user: { id: 'a1' } } as never,
      valid.mock as never,
    );
    expect(valid.result.statusCode).toBe(200);
  });

  it('prevents RECEPTIONIST from changing any user role', async () => {
    const forbiddenResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await updateUserRole(
      { params: { id: 'user-2' }, body: { role: 'VET' }, user: { role: 'RECEPTIONIST', id: 'user-1' } } as never,
      forbiddenResponse as never,
    );

    expect(forbiddenResponse.status).toHaveBeenCalledWith(403);
    expect(mockedUpdateRole).not.toHaveBeenCalled();
    expect(AuditService.record).not.toHaveBeenCalled();
  });
});
