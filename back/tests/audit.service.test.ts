import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getSupabaseClient } from '../src/config/supabase';
import { AuditService } from '../src/services/audit.service';

jest.mock('../src/config/supabase', () => ({ getSupabaseClient: jest.fn() }));

const mockedGetSupabaseClient = jest.mocked(getSupabaseClient);

describe('AuditService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('records an audit event with normalized entity identifiers', async () => {
    const insert = jest.fn(async (..._args: unknown[]) => ({ error: null }));
    mockedGetSupabaseClient.mockReturnValue({ from: jest.fn().mockReturnValue({ insert }) } as never);

    await AuditService.record({ actorUserId: 'admin-1', action: 'UPDATE_ROLE', entityName: 'profiles', entityId: 7 });

    expect(insert).toHaveBeenCalledWith({
      actor_user_id: 'admin-1',
      action: 'UPDATE_ROLE',
      table_name: 'profiles',
      entity_name: 'profiles',
      entity_id: '7',
      metadata: {},
    });
  });

  it('clamps audit list limits to the supported range', async () => {
    const limit = jest.fn(async (..._args: unknown[]) => ({ data: [{ id: 1 }], error: null }));
    const order = jest.fn().mockReturnValue({ limit });
    mockedGetSupabaseClient.mockReturnValue({
      from: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ order }) }),
    } as never);

    await expect(AuditService.list(999)).resolves.toEqual([{ id: 1 }]);
    expect(limit).toHaveBeenCalledWith(200);
  });
});
