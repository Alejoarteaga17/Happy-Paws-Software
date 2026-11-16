import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getSupabaseClient } from '../src/config/supabase';
import { SearchService } from '../src/services/search.service';

jest.mock('../src/config/supabase', () => ({ getSupabaseClient: jest.fn() }));

const mockedGetSupabaseClient = jest.mocked(getSupabaseClient);

describe('SearchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('searches owners by contact fields and pets by name or tag', async () => {
    const ownerLimit = jest.fn(async () => ({
      data: [{ id: 1, full_name: 'Ana', phone: '300', email: 'ana@example.com' }],
      error: null,
    }));
    const petLimit = jest.fn(async () => ({
      data: [{ id: 2, owner_id: 1, name: 'Luna', pet_tag: 'HP-1', species: 'Gato', owners: [{ full_name: 'Ana' }] }],
      error: null,
    }));
    const ownerChain = {
      select: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: ownerLimit,
    };
    const petChain = {
      select: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: petLimit,
    };
    const from = jest.fn((table: string) => (table === 'owners' ? ownerChain : petChain));
    mockedGetSupabaseClient.mockReturnValue({ from } as never);

    await expect(SearchService.search(' Ana ')).resolves.toEqual([
      { type: 'OWNER', id: 1, title: 'Ana', subtitle: '300 · ana@example.com' },
      { type: 'PET', id: 2, ownerId: 1, title: 'Luna', subtitle: 'HP-1 · Ana · Gato' },
    ]);
    expect(ownerChain.or).toHaveBeenCalledWith('full_name.ilike.%Ana%,phone.ilike.%Ana%,email.ilike.%Ana%');
    expect(petChain.or).toHaveBeenCalledWith('name.ilike.%Ana%,pet_tag.ilike.%Ana%');
  });

  it('surfaces failures from either search query', async () => {
    const failed = { data: null, error: { message: 'database unavailable' } };
    const chain = {
      select: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn(async () => failed),
    };
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue(chain) } as never);

    await expect(SearchService.search('Ana')).rejects.toThrow('SEARCH_FAILED: database unavailable');
  });

  it('escapes PostgREST filter syntax in user-controlled search text', async () => {
    const limit = jest.fn(async () => ({ data: [], error: null }));
    const chain = {
      select: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit,
    };
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue(chain) } as never);

    await SearchService.search('a),id.neq.0');

    expect(chain.or).toHaveBeenNthCalledWith(
      1,
      'full_name.ilike.%a\\)\\,id\\.neq\\.0%,phone.ilike.%a\\)\\,id\\.neq\\.0%,email.ilike.%a\\)\\,id\\.neq\\.0%',
    );
  });

  it('keeps the parallel owner and pet queries below the two-second requirement', async () => {
    const limit = jest.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ data: [], error: null }), 1100);
        }),
    );
    const chain = {
      select: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit,
    };
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue(chain) } as never);

    const startedAt = performance.now();
    await SearchService.search('Ana');
    const elapsed = performance.now() - startedAt;

    expect(elapsed).toBeLessThan(2000);
  }, 3000);
});
