import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getSupabaseClient } from '../src/config/supabase';
import { PortalService } from '../src/services/portal.service';

jest.mock('../src/config/supabase', () => ({ getSupabaseClient: jest.fn() }));
const mockedGetSupabaseClient = jest.mocked(getSupabaseClient);

const createChain = (result: { data: unknown; error: unknown }) => {
  const chain = {
    select: jest.fn(() => chain),
    eq: jest.fn((..._args: unknown[]) => chain),
    in: jest.fn((..._args: unknown[]) => chain),
    order: jest.fn(async () => result),
    single: jest.fn(async () => result),
  };
  return chain;
};

describe('PortalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('filters pets and related records by the authenticated owner', async () => {
    const ownerQuery = createChain({
      data: { id: 7, full_name: 'Ana Pérez', phone: '3000000000', email: null, address: null },
      error: null,
    });
    const petsQuery = createChain({
      data: [{ id: 3, owner_id: 7, name: 'Milo' }],
      error: null,
    });
    const appointmentsQuery = createChain({ data: [], error: null });
    const vaccinationsQuery = createChain({ data: [], error: null });
    const from = jest
      .fn()
      .mockReturnValueOnce(ownerQuery)
      .mockReturnValueOnce(petsQuery)
      .mockReturnValueOnce(appointmentsQuery)
      .mockReturnValueOnce(vaccinationsQuery);
    mockedGetSupabaseClient.mockReturnValue({ from } as never);

    await expect(PortalService.getDashboard(7)).resolves.toMatchObject({
      owner: { id: 7 },
      pets: [{ id: 3 }],
    });
    expect(ownerQuery.eq).toHaveBeenCalledWith('id', 7);
    expect(petsQuery.eq).toHaveBeenCalledWith('owner_id', 7);
    expect(appointmentsQuery.in).toHaveBeenCalledWith('pet_id', [3]);
    expect(vaccinationsQuery.in).toHaveBeenCalledWith('pet_id', [3]);
  });

  it('returns empty related collections when the owner has no pets', async () => {
    const ownerQuery = createChain({
      data: { id: 7, full_name: 'Ana Pérez', phone: '3000000000', email: null, address: null },
      error: null,
    });
    const petsQuery = createChain({ data: [], error: null });
    const from = jest.fn().mockReturnValueOnce(ownerQuery).mockReturnValueOnce(petsQuery);
    mockedGetSupabaseClient.mockReturnValue({ from } as never);

    await expect(PortalService.getDashboard(7)).resolves.toMatchObject({
      pets: [],
      appointments: [],
      vaccinations: [],
    });
    expect(from).toHaveBeenCalledTimes(2);
  });

  it('fails explicitly when the owner cannot be loaded', async () => {
    const ownerQuery = createChain({ data: null, error: { message: 'missing' } });
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue(ownerQuery) } as never);

    await expect(PortalService.getDashboard(99)).rejects.toThrow('OWNER_NOT_FOUND');
  });
});
