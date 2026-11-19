import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createOwner, deleteOwner, getOwners, updateOwner } from '../src/services/owner-service';

vi.mock('../src/services/supabase-client', () => ({
  isSupabaseConfigured: true,
  getSupabaseClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'staff-token' } }, error: null }),
    },
  }),
}));

describe('owner service', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4000');
    vi.restoreAllMocks();
  });

  it('supports listing, creating and updating owners through the API', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: [], error: null })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { id: 1 }, error: null })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { id: 1 }, error: null })));
    vi.stubGlobal('fetch', fetchMock);

    await expect(getOwners()).resolves.toEqual([]);
    await createOwner({ fullName: 'Ana', phone: '300', email: 'ana@example.com' });
    await updateOwner(1, { phone: '301' });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:4000/api/v1/owners',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      'http://localhost:4000/api/v1/owners/1',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('surfaces owner API errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false, data: null, error: { message: 'Duplicado' } }), {
          status: 409,
        }),
      ),
    );

    await expect(createOwner({ fullName: 'Ana', phone: '300' })).rejects.toThrow('Duplicado');
  });

  it('deletes an owner through the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            data: { id: 7, fullName: 'Ana', deletedPets: 2 },
            error: null,
          }),
        ),
      ),
    );

    await expect(deleteOwner(7)).resolves.toEqual({ id: 7, fullName: 'Ana', deletedPets: 2 });
  });
});
