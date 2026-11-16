import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getSupabaseClient } from '../src/config/supabase';
import { OwnerService } from '../src/services/owner.service';

jest.mock('../src/config/supabase', () => ({ getSupabaseClient: jest.fn() }));

const mockedGetSupabaseClient = jest.mocked(getSupabaseClient);

describe('OwnerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normalizes owner data before creating it', async () => {
    const single = jest.fn(async () => ({ data: { id: 1, full_name: 'Ana' }, error: null }));
    const select = jest.fn().mockReturnValue({ single });
    const insert = jest.fn().mockReturnValue({ select });
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue({ insert }) } as never);

    await OwnerService.create({ fullName: ' Ana ', phone: ' 300 ', email: ' ana@example.com ' });

    expect(insert).toHaveBeenCalledWith({
      full_name: 'Ana',
      phone: '300',
      email: 'ana@example.com',
      address: null,
      auth_user_id: null,
    });
  });

  it('lists only active owners and supports soft activation changes', async () => {
    const order = jest.fn(async (..._args: unknown[]) => ({ data: [{ id: 1 }], error: null }));
    const listQuery = {
      select: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      order,
    };
    const maybeSingle = jest.fn(async (..._args: unknown[]) => ({ data: { id: 1 }, error: null }));
    const statusUpdate = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ maybeSingle }) }),
    });
    const from = jest.fn().mockReturnValueOnce(listQuery).mockReturnValueOnce({ update: statusUpdate });
    mockedGetSupabaseClient.mockReturnValue({ from } as never);

    await expect(OwnerService.list()).resolves.toEqual([{ id: 1 }]);
    await expect(OwnerService.setActive(1, false)).resolves.toEqual({ id: 1 });
    expect(statusUpdate).toHaveBeenCalledWith({ deleted_at: expect.any(String) });
  });

  it('preserves the owner-not-found and duplicate-link domain errors', async () => {
    const maybeSingle = jest.fn(async () => ({ data: null, error: null }));
    const select = jest.fn().mockReturnValue({ maybeSingle });
    const update = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({ is: jest.fn().mockReturnValue({ select }) }),
    });
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue({ update }) } as never);

    await expect(OwnerService.update(7, { phone: '300' })).rejects.toThrow('OWNER_NOT_FOUND');

    const single = jest.fn(async () => ({ data: null, error: { code: '23505', message: 'duplicate' } }));
    mockedGetSupabaseClient.mockReturnValue({
      from: jest
        .fn()
        .mockReturnValue({ insert: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single }) }) }),
    } as never);
    await expect(OwnerService.create({ fullName: 'Ana', phone: '300' })).rejects.toThrow('OWNER_ALREADY_LINKED');
  });
});
