import { describe, expect, it, vi } from 'vitest';
import { getOwnerPortal, mapPortal } from '../src/services/portal-service';

vi.mock('../src/services/supabase-client', () => ({
  isSupabaseConfigured: true,
  getSupabaseClient: () => ({
    auth: { getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'owner-token' } }, error: null }) },
  }),
}));

const portalRow = {
  owner: { id: 7, full_name: 'Ana Pérez', phone: '3000000000', email: 'ana@example.com', address: null },
  pets: [
    {
      id: 3,
      owner_id: 7,
      pet_tag: 'HP-003',
      name: 'Milo',
      species: 'Perro',
      breed: null,
      birth_date: null,
      weight: 8,
      created_at: '2026-09-01T00:00:00Z',
    },
  ],
  appointments: [
    {
      id: 11,
      pet_id: 3,
      vet_id: 'vet-1',
      scheduled_at: '2026-10-10T14:00:00Z',
      reason: 'Control',
      notes: 'Estable',
      status: 'SCHEDULED' as const,
    },
  ],
  vaccinations: [
    {
      id: 12,
      pet_id: 3,
      vaccine_name: 'Rabia',
      administered_at: '2026-09-01',
      next_due_date: '2027-09-01',
      status: 'ADMINISTERED' as const,
    },
  ],
};

describe('portal service', () => {
  it('maps the owner-scoped aggregate without changing ownership', () => {
    expect(mapPortal(portalRow)).toMatchObject({
      owner: { id: 7, fullName: 'Ana Pérez' },
      pets: [{ id: 3, ownerId: 7, ownerName: 'Ana Pérez', createdAt: '2026-09-01T00:00:00Z' }],
      appointments: [{ petId: 3, petName: 'Milo', notes: 'Estable' }],
      vaccinations: [{ petId: 3, petName: 'Milo' }],
    });
  });

  it('requests only the authenticated owner portal endpoint', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4000');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: portalRow, error: null }), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(getOwnerPortal()).resolves.toMatchObject({ owner: { id: 7 } });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/api/v1/portal/me',
      expect.objectContaining({ headers: { Authorization: 'Bearer owner-token' } }),
    );
  });

  it('surfaces the API error instead of returning an empty success state', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4000');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false, data: null, error: { message: 'No autorizado' } }), { status: 403 }),
      ),
    );

    await expect(getOwnerPortal()).rejects.toThrow('No autorizado');
  });
});
