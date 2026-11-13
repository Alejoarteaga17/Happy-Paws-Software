import { getSupabaseClient } from '../config/supabase';
import { ClinicalNote, CreateClinicalNoteInput } from '../types/clinical-note';

interface ClinicalNoteRow {
  id: number;
  appointment_id: number;
  diagnosis: string;
  treatment: string;
  observations: string | null;
  created_at: string;
  appointments:
    | {
        pet_id: number;
        pets: { name: string }[] | null;
      }[]
    | null;
  profiles: { full_name: string }[] | null;
  veterinarian_id: string;
}

const select = `
  id, appointment_id, diagnosis, treatment, observations, created_at, veterinarian_id,
  appointments(pet_id, pets(name)),
  profiles!clinical_notes_veterinarian_id_fkey(full_name)
`;

const toClinicalNote = (row: ClinicalNoteRow): ClinicalNote => ({
  id: row.id,
  appointmentId: row.appointment_id,
  petId: row.appointments?.[0]?.pet_id ?? 0,
  petName: row.appointments?.[0]?.pets?.[0]?.name ?? 'Mascota sin nombre',
  veterinarianId: row.veterinarian_id,
  veterinarianName: row.profiles?.[0]?.full_name ?? 'Veterinario sin nombre',
  diagnosis: row.diagnosis,
  treatment: row.treatment,
  observations: row.observations,
  createdAt: row.created_at,
});

export class ClinicalNoteService {
  static async list(): Promise<ClinicalNote[]> {
    const { data, error } = await getSupabaseClient()
      .from('clinical_notes')
      .select(select)
      .order('created_at', { ascending: false });
    if (error) throw new Error(`CLINICAL_NOTES_LIST_FAILED: ${error.message}`);
    return (data as ClinicalNoteRow[]).map(toClinicalNote);
  }

  static async create(input: CreateClinicalNoteInput, veterinarianId: string): Promise<ClinicalNote> {
    const { data, error } = await getSupabaseClient()
      .from('clinical_notes')
      .insert({
        appointment_id: input.appointmentId,
        veterinarian_id: veterinarianId,
        diagnosis: input.diagnosis.trim(),
        treatment: input.treatment.trim(),
        observations: input.observations?.trim() || null,
      })
      .select(select)
      .single();
    if (error || !data) {
      if (error?.code === '23503') throw new Error('APPOINTMENT_NOT_FOUND');
      throw new Error(`CLINICAL_NOTE_CREATE_FAILED: ${error?.message ?? 'No se pudo crear la nota.'}`);
    }
    return toClinicalNote(data as ClinicalNoteRow);
  }
}
