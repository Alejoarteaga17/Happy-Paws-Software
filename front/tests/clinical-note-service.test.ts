import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createClinicalNote, getClinicalNotes } from '../src/services/clinical-note-service';

vi.mock('../src/services/supabase-client', () => ({
  isSupabaseConfigured: true,
  getSupabaseClient: () => ({
    auth: { getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'vet-token' } }, error: null }) },
  }),
}));

describe('clinical note service', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4000/');
    vi.restoreAllMocks();
  });

  it('lists notes using the authenticated session', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: [{ id: 1 }], error: null }))),
    );

    await expect(getClinicalNotes()).resolves.toEqual([{ id: 1 }]);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/v1/clinical-notes',
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer vet-token' }) }),
    );
  });

  it('serializes a clinical note and surfaces API validation errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false, data: null, error: { message: 'La cita no está asignada' } }), {
          status: 403,
        }),
      ),
    );

    await expect(
      createClinicalNote({ appointmentId: 7, diagnosis: 'Dermatitis', treatment: 'Tratamiento' }),
    ).rejects.toThrow('La cita no está asignada');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/v1/clinical-notes',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ appointmentId: 7, diagnosis: 'Dermatitis', treatment: 'Tratamiento' }),
      }),
    );
  });
});
