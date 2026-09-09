import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

const secret = process.env.JWT_SECRET ?? 'development-secret';

type TokenPayload = { sub: string; role: UserRole; email: string };

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Token requerido.' } });
    return;
  }
  try {
    const payload = jwt.verify(header.slice(7), secret) as TokenPayload;
    req.user = { id: BigInt(payload.sub), role: payload.role, email: payload.email };
    next();
  } catch {
    res.status(401).json({ success: false, data: null, error: { code: 'INVALID_TOKEN', message: 'Token invalido o expirado.' } });
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, data: null, error: { code: 'FORBIDDEN', message: 'No tienes permisos para esta accion.' } });
      return;
    }
    next();
  };
}
