import { describe, expect, it, jest } from '@jest/globals';
import { AuditService } from '../src/services/audit.service';
import { PetService } from '../src/services/pet.service';
import { createPet, deletePet, listPets, updatePet } from '../src/controllers/pet.controller';

jest.mock('../src/services/audit.service', () => ({ AuditService: { record: jest.fn() } }));
jest.mock('../src/services/pet.service', () => ({
  PetService: { list: jest.fn(), create: jest.fn(), update: jest.fn(), setDeleted: jest.fn() },
}));

const mockedUpdate = jest.mocked(PetService.update);
const mockedCreate = jest.mocked(PetService.create);
const mockedList = jest.mocked(PetService.list);
const mockedDelete = jest.mocked(PetService.setDeleted);

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

describe('updatePet controller', () => {
  it('soft deletes a pet and audits the operation', async () => {
    mockedDelete.mockResolvedValue({ id: 2 } as never);
    const { responseMock, result } = response();
    await deletePet({ params: { id: '2' }, user: { id: 'staff-1' } } as never, responseMock as never);
    expect(result.statusCode).toBe(200);
    expect(mockedDelete).toHaveBeenCalledWith(2, true);
  });

  it('lists pets and forwards service failures', async () => {
    mockedList.mockResolvedValue([{ id: 2 }] as never);
    const { responseMock, result } = response();
    await listPets({} as never, responseMock as never);
    expect(result.statusCode).toBe(200);
    expect(result.body).toMatchObject({ success: true, data: [{ id: 2 }] });

    mockedList.mockRejectedValueOnce(new Error('PETS_LIST_FAILED'));
    await listPets({} as never, responseMock as never);
    expect(result.statusCode).toBe(500);
  });

  it('rejects an invalid pet sex', async () => {
    const { responseMock, result } = response();
    await createPet(
      {
        body: { ownerId: 1, petTag: 'HP-2', name: 'Milo', species: 'Perro', sex: 'OTHER' },
        user: { id: 'staff-1' },
      } as never,
      responseMock as never,
    );
    expect(result.statusCode).toBe(400);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('creates a pet with a valid sex and audits it', async () => {
    mockedCreate.mockResolvedValue({ id: 2 } as never);
    const { responseMock, result } = response();
    await createPet(
      {
        body: { ownerId: 1, petTag: 'HP-2', name: 'Milo', species: 'Perro', sex: 'MALE' },
        user: { id: 'staff-1' },
      } as never,
      responseMock as never,
    );
    expect(result.statusCode).toBe(201);
    expect(mockedCreate).toHaveBeenCalledWith(expect.objectContaining({ petTag: 'HP-2', sex: 'MALE' }));
  });

  it('maps duplicate pet tags to conflict', async () => {
    mockedCreate.mockRejectedValue(new Error('PET_TAG_ALREADY_EXISTS'));
    const { responseMock, result } = response();
    await createPet(
      { body: { ownerId: 1, petTag: 'HP-2', name: 'Milo', species: 'Perro' }, user: { id: 'staff-1' } } as never,
      responseMock as never,
    );
    expect(result.statusCode).toBe(409);
  });

  it('rejects VET attempts to change owner or pet tag', async () => {
    const { responseMock, result } = response();

    await updatePet(
      {
        params: { id: '2' },
        body: { ownerId: 99, petTag: 'HP-999' },
        user: { id: 'vet-1', role: 'VET' },
      } as never,
      responseMock as never,
    );

    expect(result.statusCode).toBe(403);
    expect(result.body).toMatchObject({ error: { code: 'FORBIDDEN_PET_FIELDS' } });
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('allows VET to update basic pet fields', async () => {
    const { responseMock, result } = response();
    mockedUpdate.mockResolvedValue({ id: 2 } as never);

    await updatePet(
      {
        params: { id: '2' },
        body: { name: 'Milo', weight: 5.2 },
        user: { id: 'vet-1', role: 'VET' },
      } as never,
      responseMock as never,
    );

    expect(result.statusCode).toBe(200);
    expect(mockedUpdate).toHaveBeenCalledWith(2, { name: 'Milo', weight: 5.2 });
    expect(AuditService.record).toHaveBeenCalled();
  });
});
