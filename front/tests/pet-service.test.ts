import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPet, getPets } from '../src/services/pet-service';

vi.mock('../src/services/supabase-client', () => ({
  isSupabaseConfigured: true,
  getSupabaseClient: () => ({ auth: { getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'token' } }, error: null }) } })
}));

describe('pet service', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4000/');
    vi.restoreAllMocks();
  });

  it('gets pets with an authenticated request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: [{ id: 1 }], error: null }), { status: 200 })));

    await expect(getPets()).resolves.toEqual([{ id: 1 }]);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/v1/pets', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer token' })
    }));
  });

  it('serializes a new pet and translates duplicate tags', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, data: null, error: { code: 'PET_TAG_ALREADY_EXISTS' } }), { status: 409 })));

    await expect(createPet({ ownerId: 1, petTag: 'HP-1', name: 'Luna', species: 'Gato' }))
      .rejects.toThrow('El pet_tag ya está registrado.');
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/v1/pets', expect.objectContaining({
      method: 'POST', body: JSON.stringify({ ownerId: 1, petTag: 'HP-1', name: 'Luna', species: 'Gato' })
    }));
  });
});