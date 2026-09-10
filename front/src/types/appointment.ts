export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

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

export interface AppointmentInput {
  petId: number;
  scheduledAt: string;
  reason: string;
  status?: AppointmentStatus;
}