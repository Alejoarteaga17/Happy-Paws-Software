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

export async function allowAnonymousRead(request: Request, response: Response, next: NextFunction): Promise<void> {
  const authorization = request.header('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;

  if (!token && process.env.ALLOW_ANONYMOUS_READS === 'true') {
    next();
    return;
  }

  await requireAuth(request, response, next);
}

export const requireRoles = (...allowedRoles: string[]) => {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const authorization = request.header('authorization');
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;

    if (!token) {
      response.status(401).json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Se requiere un token de Supabase' } });
      return;
    }

    const { data: userData, error: userError } = await getSupabaseClient().auth.getUser(token);
    if (userError || !userData.user) {
      response.status(401).json({ success: false, data: null, error: { code: 'INVALID_TOKEN', message: 'El token no es válido' } });
      return;
    }

    const { data: profile, error: profileError } = await getSupabaseClient()
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .maybeSingle();

    if (profileError || !profile || !allowedRoles.includes(profile.role as string)) {
      response.status(403).json({ success: false, data: null, error: { code: 'FORBIDDEN_ACCESS', message: 'No tienes permisos para gestionar mascotas.' } });
      return;
    }

    next();
  };
};