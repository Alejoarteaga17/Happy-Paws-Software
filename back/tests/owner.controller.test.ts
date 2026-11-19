import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AuditService } from '../src/services/audit.service';
import { OwnerService } from '../src/services/owner.service';
import {
  createOwner,
  deleteOwner,
  getOwner,
  listOwners,
  updateOwner,
  updateOwnerStatus,
} from '../src/controllers/owner.controller';

jest.mock('../src/services/audit.service', () => ({ AuditService: { record: jest.fn() } }));
jest.mock('../src/services/owner.service', () => ({
  OwnerService: {
    list: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    setActive: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedOwner = jest.mocked(OwnerService);

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

describe('owner controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(AuditService.record).mockReset();
  });

  it('lists owners', async () => {
    mockedOwner.list.mockResolvedValue([{ id: 1 }] as never);
    const { mock, result } = response();
    await listOwners({} as never, mock as never);
    expect(result.statusCode).toBe(200);
  });

  it('rejects invalid owner ids', async () => {
    const { mock, result } = response();
    await getOwner({ params: { id: 'bad' } } as never, mock as never);
    expect(result.statusCode).toBe(400);
  });

  it('rejects incomplete owner payloads', async () => {
    const { mock, result } = response();
    await createOwner({ body: { fullName: '', phone: '' }, user: { id: 'u1' } } as never, mock as never);
    expect(result.statusCode).toBe(400);
  });

  it('rejects an invalid owner email with an explicit message', async () => {
    const { mock, result } = response();
    await createOwner(
      { body: { fullName: 'Ana Perez', phone: '3001234567', email: 'correo-invalido' }, user: { id: 'u1' } } as never,
      mock as never,
    );
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({ message: expect.stringContaining('correo electrónico') }),
      }),
    );
  });

  it('creates an owner and audits it', async () => {
    mockedOwner.create.mockResolvedValue({ id: 7 } as never);
    const { mock, result } = response();
    await createOwner(
      { body: { fullName: 'Ana', phone: '3001234567', email: 'ana@example.com' }, user: { id: 'u1' } } as never,
      mock as never,
    );
    expect(result.statusCode).toBe(201);
    expect(AuditService.record).toHaveBeenCalled();
  });

  it('does not fail owner creation when the audit log fails', async () => {
    mockedOwner.create.mockResolvedValue({ id: 7 } as never);
    jest.mocked(AuditService.record).mockRejectedValueOnce(new Error('AUDIT_LOG_FAILED'));
    const { mock, result } = response();
    await createOwner(
      { body: { fullName: 'Ana', phone: '3001234567', email: 'ana@example.com' }, user: { id: 'u1' } } as never,
      mock as never,
    );
    expect(result.statusCode).toBe(201);
  });

  it('updates an owner', async () => {
    mockedOwner.update.mockResolvedValue({ id: 7 } as never);
    const { mock, result } = response();
    await updateOwner(
      { params: { id: '7' }, body: { phone: '3007654321' }, user: { id: 'u1' } } as never,
      mock as never,
    );
    expect(result.statusCode).toBe(200);
  });

  it('rejects invalid status payloads', async () => {
    const { mock, result } = response();
    await updateOwnerStatus({ params: { id: '7' }, body: {} } as never, mock as never);
    expect(result.statusCode).toBe(400);
  });

  it('changes owner active state', async () => {
    mockedOwner.setActive.mockResolvedValue({ id: 7 } as never);
    const { mock, result } = response();
    await updateOwnerStatus(
      { params: { id: '7' }, body: { active: false }, user: { id: 'u1' } } as never,
      mock as never,
    );
    expect(result.statusCode).toBe(200);
  });

  it('deletes an owner and reports associated pets', async () => {
    mockedOwner.delete.mockResolvedValue({ id: 7, fullName: 'Ana', deletedPets: 2 } as never);
    const { mock, result } = response();
    await deleteOwner({ params: { id: '7' }, user: { id: 'u1' } } as never, mock as never);
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({ deletedPets: 2 }),
      }),
    );
  });
});
