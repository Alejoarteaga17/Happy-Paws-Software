import { beforeEach, describe, expect, it, vi } from 'vitest';
import { searchRecords } from '../src/services/search-service';

vi.mock('../src/services/supabase-client', () => ({
  isSupabaseConfigured: true,
  getSupabaseClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'staff-token' } }, error: null }),
    },
  }),
}));

describe('search service', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4000');
    vi.restoreAllMocks();
  });

  it('encodes the owner or pet search query and sends the session token', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: [{ type: 'PET' }], error: null }))),
    );

    await expect(searchRecords('Luna & Coco')).resolves.toEqual([{ type: 'PET' }]);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/v1/search?q=Luna%20%26%20Coco',
      expect.objectContaining({ headers: { Authorization: 'Bearer staff-token' } }),
    );
  });

  it('does not hide an API search failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false, data: null, error: { message: 'No autorizado' } }), {
          status: 403,
        }),
      ),
    );

    await expect(searchRecords('Ana')).rejects.toThrow('No autorizado');
  });

  it('rejects invalid search lengths before making a request', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchRecords('a')).rejects.toThrow('entre 2 y 100');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
