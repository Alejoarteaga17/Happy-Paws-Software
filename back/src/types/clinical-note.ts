export interface ClinicalNote {
  id: number;
  appointmentId: number;
  petId: number;
  petName: string;
  veterinarianId: string;
  veterinarianName: string;
  diagnosis: string;
  treatment: string;
  observations: string | null;
  createdAt: string;
}

export interface CreateClinicalNoteInput {
  appointmentId: number;
  diagnosis: string;
  treatment: string;
  observations?: string | null;
}
