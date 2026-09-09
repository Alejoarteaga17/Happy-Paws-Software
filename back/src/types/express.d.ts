import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: { id: bigint; role: UserRole; email: string };
    }
  }
}

export {};
