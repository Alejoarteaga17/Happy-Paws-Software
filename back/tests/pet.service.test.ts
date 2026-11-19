import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getSupabaseClient } from '../src/config/supabase';
import { PetService } from '../src/services/pet.service';

jest.mock('../src/config/supabase', () => ({
  getSupabaseClient: jest.fn(),
}));

const mockedGetSupabaseClient = jest.mocked(getSupabaseClient);

describe('PetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists pets ordered by name and maps database fields', async () => {
    const order = jest.fn(async (..._args: unknown[]) => ({
      data: [
        {
          id: 1,
          created_at: '2026-09-10T10:00:00Z',
          owner_id: 7,
          pet_tag: 'HP-001',
          name: 'Luna',
          species: 'Gato',
          breed: null,
          birth_date: null,
          weight: 4.2,
          sex: 'FEMALE',
          updated_at: '2026-09-11T10:00:00Z',
          owners: [{ full_name: 'Ana Perez' }],
        },
      ],
      error: null,
    }));
    const select = jest.fn().mockReturnValue({ is: jest.fn().mockReturnValue({ order }) });
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue({ select }) } as never);

    await expect(PetService.list()).resolves.toEqual([
      {
        id: 1,
        createdAt: '2026-09-10T10:00:00Z',
        ownerId: 7,
        ownerName: 'Ana Perez',
        petTag: 'HP-001',
        name: 'Luna',
        species: 'Gato',
        breed: null,
        birthDate: null,
        weight: 4.2,
        sex: 'FEMALE',
        updatedAt: '2026-09-11T10:00:00Z',
      },
    ]);
    expect(order).toHaveBeenCalledWith('name', { ascending: true });
  });

  it('creates a pet with trimmed values', async () => {
    const ownerMaybeSingle = jest.fn(async () => ({ data: { id: 7 }, error: null }));
    const single = jest.fn(async () => ({
      data: {
        id: 2,
        created_at: '2026-09-10T10:00:00Z',
        owner_id: 7,
        pet_tag: 'HP-002',
        name: 'Milo',
        species: 'Perro',
        breed: null,
        birth_date: null,
        weight: null,
        sex: 'MALE',
        updated_at: '2026-09-11T10:00:00Z',
        owners: [{ full_name: 'Ana Perez' }],
      },
      error: null,
    }));
    const select = jest.fn().mockReturnValue({ single });
    const insert = jest.fn().mockReturnValue({ select });
    const from = jest.fn().mockImplementation((table: unknown) =>
      table === 'owners'
        ? {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({ is: jest.fn().mockReturnValue({ maybeSingle: ownerMaybeSingle }) }),
            }),
          }
        : { insert },
    );
    mockedGetSupabaseClient.mockReturnValue({ from } as never);

    await expect(
      PetService.create({ ownerId: 7, petTag: ' HP-002 ', name: ' Milo ', species: ' Perro ' }),
    ).resolves.toMatchObject({ petTag: 'HP-002', name: 'Milo', species: 'Perro' });
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ owner_id: 7, pet_tag: 'HP-002', name: 'Milo', species: 'Perro' }),
    );
  });

  it('translates duplicate pet tags into a domain error', async () => {
    const ownerMaybeSingle = jest.fn(async () => ({ data: { id: 7 }, error: null }));
    const single = jest.fn(async () => ({ data: null, error: { code: '23505' } }));
    const select = jest.fn().mockReturnValue({ single });
    const from = jest.fn().mockImplementation((table: unknown) =>
      table === 'owners'
        ? {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({ is: jest.fn().mockReturnValue({ maybeSingle: ownerMaybeSingle }) }),
            }),
          }
        : { insert: jest.fn().mockReturnValue({ select }) },
    );
    mockedGetSupabaseClient.mockReturnValue({ from } as never);

    await expect(PetService.create({ ownerId: 7, petTag: 'HP-001', name: 'Luna', species: 'Gato' })).rejects.toThrow(
      'PET_TAG_ALREADY_EXISTS',
    );
  });

  it('rejects assigning a pet to an inactive owner', async () => {
    const ownerMaybeSingle = jest.fn(async () => ({ data: null, error: null }));
    const from = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({ is: jest.fn().mockReturnValue({ maybeSingle: ownerMaybeSingle }) }),
      }),
    });
    mockedGetSupabaseClient.mockReturnValue({ from } as never);

    await expect(PetService.create({ ownerId: 7, petTag: 'HP-003', name: 'Nina', species: 'Gato' })).rejects.toThrow(
      'OWNER_INACTIVE',
    );
  });

  it('updates a pet with normalized fields', async () => {
    const maybeSingle = jest.fn(async () => ({
      data: {
        id: 2,
        created_at: '2026-09-10T10:00:00Z',
        owner_id: 7,
        pet_tag: 'HP-002',
        name: 'Milo',
        species: 'Perro',
        breed: null,
        birth_date: null,
        weight: 5,
        owners: [{ full_name: 'Ana Perez' }],
      },
      error: null,
    }));
    const select = jest.fn().mockReturnValue({ maybeSingle });
    const update = jest
      .fn()
      .mockReturnValue({ eq: jest.fn().mockReturnValue({ is: jest.fn().mockReturnValue({ select }) }) });
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue({ update }) } as never);

    await PetService.update(2, { name: ' Milo ', species: ' Perro ' });
    expect(update).toHaveBeenCalledWith({ name: 'Milo', species: 'Perro' });
  });

  it('soft deletes a pet without removing its row', async () => {
    const maybeSingle = jest.fn(async () => ({
      data: {
        id: 2,
        created_at: '2026-09-10T10:00:00Z',
        owner_id: 7,
        pet_tag: 'HP-002',
        name: 'Milo',
        species: 'Perro',
        breed: null,
        birth_date: null,
        weight: null,
        owners: [{ full_name: 'Ana Perez' }],
      },
      error: null,
    }));
    const select = jest.fn().mockReturnValue({ maybeSingle });
    const update = jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ select }) });
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue({ update }) } as never);

    await PetService.setDeleted(2, true);
    expect(update).toHaveBeenCalledWith({ deleted_at: expect.any(String) });
  });
});
