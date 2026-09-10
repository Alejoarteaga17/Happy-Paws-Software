import { getSupabaseClient } from '../config/supabase';
import { Appointment, AppointmentStatus, CreateAppointmentInput, UpdateAppointmentInput } from '../types/appointment';

interface AppointmentRow {
  id: number;
  pet_id: number;
  vet_id: string | null;
  scheduled_at: string;
  reason: string;
  notes: string | null;
  status: AppointmentStatus;
  pets: { name: string } | { name: string }[] | null;
}

const appointmentSelect = 'id, pet_id, vet_id, scheduled_at, reason, notes, status, pets(name)';

const getPetName = (pets: AppointmentRow['pets']): string | undefined => Array.isArray(pets) ? pets[0]?.name : pets?.name;

const toAppointment = (row: AppointmentRow): Appointment => ({
  id: row.id,
  petId: row.pet_id,
  petName: getPetName(row.pets) ?? 'Mascota sin nombre',
  vetId: row.vet_id,
  scheduledAt: row.scheduled_at,
  reason: row.reason,
  notes: row.notes,
  status: row.status
});

export class AppointmentService {
  static async list(): Promise<Appointment[]> {
    const { data, error } = await getSupabaseClient()
      .from('appointments')
      .select(appointmentSelect)
      .order('scheduled_at', { ascending: true });

    if (error) throw new Error(`APPOINTMENTS_LIST_FAILED: ${error.message}`);
    return (data as AppointmentRow[]).map(toAppointment);
  }

  static async getById(id: number): Promise<Appointment> {
    const { data, error } = await getSupabaseClient()
      .from('appointments')
      .select(appointmentSelect)
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`APPOINTMENT_LOOKUP_FAILED: ${error.message}`);
    if (!data) throw new Error('APPOINTMENT_NOT_FOUND');
    return toAppointment(data as AppointmentRow);
  }

  static async create(input: CreateAppointmentInput): Promise<Appointment> {
    const supabase = getSupabaseClient();
    let vetId = input.vetId;

    if (!vetId) {
      const { data: vet, error: vetLookupError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'VET')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (vetLookupError) throw new Error('VET_LOOKUP_FAILED');
      if (!vet) throw new Error('VET_NOT_FOUND');
      vetId = vet.id as string;
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert({ pet_id: input.petId, vet_id: vetId, scheduled_at: input.scheduledAt, reason: input.reason, status: input.status ?? 'SCHEDULED' })
      .select(appointmentSelect)
      .single();

    if (error || !data) {
      if (error?.code === '23503' && error.message.includes('vet_id')) {
        throw new Error('VET_NOT_FOUND');
      }

      if (error?.code === '23502' && error.message.includes('vet_id')) {
        throw new Error('VET_NOT_FOUND');
      }

      throw new Error('APPOINTMENT_CREATE_FAILED');
    }
    return toAppointment(data as AppointmentRow);
  }

  static async update(id: number, input: UpdateAppointmentInput): Promise<Appointment> {
    const updateData: Record<string, number | string | null> = {};
    if (input.petId !== undefined) updateData.pet_id = input.petId;
    if (input.scheduledAt !== undefined) updateData.scheduled_at = input.scheduledAt;
    if (input.reason !== undefined) updateData.reason = input.reason;
    if (input.vetId !== undefined) updateData.vet_id = input.vetId;
    if (input.status !== undefined) updateData.status = input.status;

    const { data, error } = await getSupabaseClient()
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select(appointmentSelect)
      .maybeSingle();

    if (error) throw new Error(`APPOINTMENT_UPDATE_FAILED: ${error.message}`);
    if (!data) throw new Error('APPOINTMENT_NOT_FOUND');
    return toAppointment(data as AppointmentRow);
  }

  static async cancel(id: number): Promise<Appointment> {
    return this.update(id, { status: 'CANCELLED' });
  }
}