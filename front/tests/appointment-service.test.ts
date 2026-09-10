import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cancelAppointment, createAppointment, getAppointments, updateAppointment } from '../src/services/appointment-service';

vi.mock('../src/services/supabase-client', () => ({
  isSupabaseConfigured: false,
  getSupabaseClient: vi.fn()
}));

describe('appointment service', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4000');
    vi.restoreAllMocks();
  });

  it('lists appointments', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: [], error: null }), { status: 200 })));
    await expect(getAppointments()).resolves.toEqual([]);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/v1/appointments', expect.anything());
  });

  it('creates, updates and cancels appointments using the expected endpoints', async () => {
    const response = () => new Response(JSON.stringify({ success: true, data: { id: 3 }, error: null }), { status: 200 });
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(response()));
    vi.stubGlobal('fetch', fetchMock);
    const input = { petId: 2, scheduledAt: '2026-09-11T14:00:00Z', reason: 'Control' };

    await createAppointment(input);
    await updateAppointment(3, { reason: 'Vacunación' });
    await cancelAppointment(3);

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      'http://localhost:4000/api/v1/appointments',
      'http://localhost:4000/api/v1/appointments/3',
      'http://localhost:4000/api/v1/appointments/3/cancel'
    ]);
  });

  it('translates a missing veterinarian error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, data: null, error: { code: 'VET_NOT_FOUND' } }), { status: 400 })));
    await expect(createAppointment({ petId: 2, scheduledAt: '2026-09-11T14:00:00Z', reason: 'Control' }))
      .rejects.toThrow('No hay un veterinario disponible');
  });
});