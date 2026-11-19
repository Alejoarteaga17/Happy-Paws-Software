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

export interface AvailableVet {
  id: string;
  fullName: string;
  email: string;
}

const appointmentSelect = 'id, pet_id, vet_id, scheduled_at, reason, notes, status, pets(name)';

const getPetName = (pets: AppointmentRow['pets']): string | undefined =>
  Array.isArray(pets) ? pets[0]?.name : pets?.name;

const toAppointment = (row: AppointmentRow): Appointment => ({
  id: row.id,
  petId: row.pet_id,
  petName: getPetName(row.pets) ?? 'Mascota sin nombre',
  vetId: row.vet_id,
  scheduledAt: row.scheduled_at,
  reason: row.reason,
  notes: row.notes,
  status: row.status,
});

export class AppointmentService {
  static async listVets(): Promise<AvailableVet[]> {
    const { data, error } = await getSupabaseClient()
      .from('profiles')
      .select('id, email, full_name')
      .eq('role', 'VET')
      .order('full_name', { ascending: true });

    if (error) throw new Error(`VETS_LIST_FAILED: ${error.message}`);
    return (data ?? []).map((vet) => ({
      id: vet.id as string,
      fullName: vet.full_name as string,
      email: vet.email as string,
    }));
  }

  private static async markPastScheduledAsMissed(): Promise<void> {
    const { error } = await getSupabaseClient()
      .from('appointments')
      .update({ status: 'MISSED' })
      .eq('status', 'SCHEDULED')
      .lt('scheduled_at', new Date().toISOString());
    if (error) throw new Error(`APPOINTMENTS_STATUS_UPDATE_FAILED: ${error.message}`);
  }

  static async list(): Promise<Appointment[]> {
    await AppointmentService.markPastScheduledAsMissed();
    const { data, error } = await getSupabaseClient()
      .from('appointments')
      .select(appointmentSelect)
      .order('scheduled_at', { ascending: true });

    if (error) throw new Error(`APPOINTMENTS_LIST_FAILED: ${error.message}`);
    return (data as AppointmentRow[]).map(toAppointment);
  }

  static async getById(id: number): Promise<Appointment> {
    await AppointmentService.markPastScheduledAsMissed();
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
    const { vetId: requestedVetId } = input;
    let vetId = requestedVetId;

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
      const { id } = vet;
      vetId = id as string;
    } else {
      const { data: vet, error: vetLookupError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', requestedVetId)
        .eq('role', 'VET')
        .maybeSingle();
      if (vetLookupError) throw new Error('VET_LOOKUP_FAILED');
      if (!vet) throw new Error('VET_NOT_FOUND');
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        pet_id: input.petId,
        vet_id: vetId,
        scheduled_at: new Date(input.scheduledAt).toISOString(),
        reason: input.reason,
        notes: input.notes?.trim() || null,
        status: input.status ?? 'SCHEDULED',
      })
      .select(appointmentSelect)
      .single();

    if (error || !data) {
      if (error?.code === '23503' && error.message.includes('vet_id')) {
        throw new Error('VET_NOT_FOUND');
      }

      if (error?.code === '23502' && error.message.includes('vet_id')) {
        throw new Error('VET_NOT_FOUND');
      }

      throw new Error(
        `APPOINTMENT_CREATE_FAILED: ${error?.code ?? 'UNKNOWN'} ${error?.message ?? 'No se pudo insertar la cita'}`,
      );
    }
    return toAppointment(data as AppointmentRow);
  }

  static async update(id: number, input: UpdateAppointmentInput): Promise<Appointment> {
    const updateData: Record<string, number | string | null> = {};
    if (input.petId !== undefined) updateData.pet_id = input.petId;
    if (input.scheduledAt !== undefined) updateData.scheduled_at = new Date(input.scheduledAt).toISOString();
    if (input.reason !== undefined) updateData.reason = input.reason;
    if (input.notes !== undefined) updateData.notes = input.notes.trim() || null;
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
