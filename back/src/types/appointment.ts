export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'MISSED';

export interface Appointment {
  id: number;
  petId: number;
  petName: string;
  vetId: string | null;
  scheduledAt: string;
  reason: string;
  notes: string | null;
  status: AppointmentStatus;
}

export interface CreateAppointmentInput {
  petId: number;
  scheduledAt: string;
  reason: string;
  notes?: string;
  vetId?: string;
  status?: AppointmentStatus;
}

export interface UpdateAppointmentInput {
  petId?: number;
  scheduledAt?: string;
  reason?: string;
  notes?: string;
  vetId?: string | null;
  status?: AppointmentStatus;
}
