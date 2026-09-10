import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getSupabaseClient } from '../src/config/supabase';
import { PetService } from '../src/services/pet.service';

jest.mock('../src/config/supabase', () => ({
  getSupabaseClient: jest.fn()
}));

const mockedGetSupabaseClient = jest.mocked(getSupabaseClient);

describe('PetService', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('lists pets ordered by name and maps database fields', async () => {
    const order = jest.fn(async (..._args: unknown[]) => ({
      data: [{
        id: 1,
        created_at: '2026-09-10T10:00:00Z',
        owner_id: 7,
        pet_tag: 'HP-001',
        name: 'Luna',
        species: 'Gato',
        breed: null,
        birth_date: null,
        weight: 4.2,
        owners: [{ full_name: 'Ana Perez' }]
      }],
      error: null
    }));
    const select = jest.fn().mockReturnValue({ order });
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue({ select }) } as never);

    await expect(PetService.list()).resolves.toEqual([{
      id: 1,
      createdAt: '2026-09-10T10:00:00Z',
      ownerId: 7,
      ownerName: 'Ana Perez',
      petTag: 'HP-001',
      name: 'Luna',
      species: 'Gato',
      breed: null,
      birthDate: null,
      weight: 4.2
    }]);
    expect(order).toHaveBeenCalledWith('name', { ascending: true });
  });

  it('creates a pet with trimmed values', async () => {
    const single = jest.fn(async () => ({
      data: {
        id: 2, created_at: '2026-09-10T10:00:00Z', owner_id: 7, pet_tag: 'HP-002',
        name: 'Milo', species: 'Perro', breed: null, birth_date: null, weight: null,
        owners: [{ full_name: 'Ana Perez' }]
      },
      error: null
    }));
    const select = jest.fn().mockReturnValue({ single });
    const insert = jest.fn().mockReturnValue({ select });
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue({ insert }) } as never);

    await expect(PetService.create({ ownerId: 7, petTag: ' HP-002 ', name: ' Milo ', species: ' Perro ' }))
      .resolves.toMatchObject({ petTag: 'HP-002', name: 'Milo', species: 'Perro' });
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ owner_id: 7, pet_tag: 'HP-002', name: 'Milo', species: 'Perro' }));
  });

  it('translates duplicate pet tags into a domain error', async () => {
    const single = jest.fn(async () => ({ data: null, error: { code: '23505' } }));
    const select = jest.fn().mockReturnValue({ single });
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue({ insert: jest.fn().mockReturnValue({ select }) }) } as never);

    await expect(PetService.create({ ownerId: 7, petTag: 'HP-001', name: 'Luna', species: 'Gato' }))
      .rejects.toThrow('PET_TAG_ALREADY_EXISTS');
  });
});