import { describe, expect, it, jest } from '@jest/globals';
import { AuditService } from '../src/services/audit.service';
import { PetService } from '../src/services/pet.service';
import { updatePet } from '../src/controllers/pet.controller';

jest.mock('../src/services/audit.service', () => ({ AuditService: { record: jest.fn() } }));
jest.mock('../src/services/pet.service', () => ({
  PetService: { update: jest.fn() },
}));

const mockedUpdate = jest.mocked(PetService.update);

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
