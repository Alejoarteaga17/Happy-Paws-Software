export type PetSex = 'MALE' | 'FEMALE' | 'UNKNOWN';

export interface Pet {
  id: number;
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  ownerName: string;
  petTag: string;
  name: string;
  species: string;
  breed: string | null;
  birthDate: string | null;
  weight: number | null;
  sex: PetSex | null;
  photoUrl: string | null;
}

export interface CreatePetInput {
  ownerId: number;
  petTag: string;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  weight?: number;
  sex?: PetSex;
  photoUrl?: string | null;
  photoDataUrl?: string;
}

export interface UpdatePetInput {
  ownerId?: number;
  petTag?: string;
  name?: string;
  species?: string;
  breed?: string | null;
  birthDate?: string | null;
  weight?: number | null;
  sex?: PetSex | null;
  photoUrl?: string | null;
  photoDataUrl?: string;
}
