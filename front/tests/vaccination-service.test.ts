import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createVaccination, getVaccinations } from '../src/services/vaccination-service';

const getSession = vi.fn();
vi.mock('../src/services/supabase-client', () => ({
  isSupabaseConfigured: true,
  getSupabaseClient: () => ({ auth: { getSession } })
}));

describe('vaccination service', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4000');
    vi.restoreAllMocks();
    getSession.mockResolvedValue({ data: { session: { access_token: 'token' } }, error: null });
  });

  it('loads vaccinations with the session token', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: [{ id: 1, status: 'PENDING' }], error: null }), { status: 200 })));
    await expect(getVaccinations()).resolves.toEqual([{ id: 1, status: 'PENDING' }]);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/v1/vaccinations', expect.objectContaining({ headers: { Authorization: 'Bearer token' } }));
  });

  it('requires an authenticated session before creating a vaccination', async () => {
    getSession.mockResolvedValue({ data: { session: null }, error: null });
    await expect(createVaccination({ petId: 1, vaccineName: 'Rabia', administeredAt: '2026-09-10', nextDueDate: '2027-09-10' }))
      .rejects.toThrow('Debes iniciar sesión');
  });

  it('creates a vaccination and reports invalid input', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, data: null, error: { code: 'INVALID_VACCINATION' } }), { status: 400 })));
    await expect(createVaccination({ petId: 1, vaccineName: 'Rabia', administeredAt: '2026-09-10', nextDueDate: '2027-09-10' }))
      .rejects.toThrow('Completa los datos de la vacunación');
  });
});