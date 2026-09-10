export interface Pet {
  id: number;
  createdAt: string;
  ownerId: number;
  ownerName: string;
  petTag: string;
  name: string;
  species: string;
  breed: string | null;
  birthDate: string | null;
  weight: number | null;
}

export interface CreatePetInput {
  ownerId: number;
  petTag: string;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  weight?: number;
}