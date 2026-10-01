export type AppRole = 'ADMIN' | 'VET' | 'RECEPTIONIST' | 'OWNER';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: AppRole;
  ownerId: number | null;
}
