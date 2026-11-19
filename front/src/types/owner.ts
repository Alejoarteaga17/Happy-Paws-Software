export interface Owner {
  id: number;
  updatedAt: string;
  fullName: string;
  phone: string;
  email: string | null;
  address?: string | null;
  authUserId?: string | null;
}

export interface OwnerInput {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
}
