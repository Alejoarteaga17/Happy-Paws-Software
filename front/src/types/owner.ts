export interface Owner {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  address?: string | null;
}

export interface OwnerInput {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
}
