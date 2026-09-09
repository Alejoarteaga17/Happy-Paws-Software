import { NextFunction, Request, Response } from 'express';
import { getSupabaseClient } from '../config/supabase';

export async function requireAuth(request: Request, response: Response, next: NextFunction): Promise<void> {
  const authorization = request.header('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;

  if (!token) {
    response.status(401).json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Se requiere un token de Supabase' } });
    return;
  }

  const { error } = await getSupabaseClient().auth.getUser(token);
  if (error) {
    response.status(401).json({ success: false, data: null, error: { code: 'INVALID_TOKEN', message: 'El token no es válido' } });
    return;
  }

  next();
}