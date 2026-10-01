import { NextFunction, Request, Response } from 'express';
import { getSupabaseClient } from '../config/supabase';
import { AppRole } from '../types/auth';

const unauthorized = (response: Response, code = 'UNAUTHORIZED'): void => {
  response.status(401).json({
    success: false,
    data: null,
    error: { code, message: code === 'INVALID_TOKEN' ? 'El token no es válido' : 'Se requiere un token de Supabase' },
  });
};

export async function requireAuth(request: Request, response: Response, next: NextFunction): Promise<void> {
  const authorization = request.header('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : undefined;
  if (!token) {
    unauthorized(response);
    return;
  }

  const supabase = getSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    unauthorized(response, 'INVALID_TOKEN');
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', userData.user.id)
    .maybeSingle();
  if (profileError || !profile) {
    unauthorized(response, 'PROFILE_NOT_FOUND');
    return;
  }

  const { data: owner, error: ownerError } = await supabase
    .from('owners')
    .select('id')
    .eq('auth_user_id', userData.user.id)
    .maybeSingle();
  if (ownerError) {
    response.status(500).json({
      success: false,
      data: null,
      error: { code: 'AUTH_CONTEXT_FAILED', message: 'No se pudo cargar el contexto del usuario.' },
    });
    return;
  }

  request.user = {
    id: userData.user.id,
    email: profile.email ?? userData.user.email ?? '',
    role: profile.role as AppRole,
    ownerId: owner?.id ?? null,
  };
  next();
}

export const requireRoles =
  (...allowedRoles: AppRole[]) =>
  (request: Request, response: Response, next: NextFunction): void => {
    if (!request.user) {
      unauthorized(response);
      return;
    }
    if (!allowedRoles.includes(request.user.role)) {
      response.status(403).json({
        success: false,
        data: null,
        error: { code: 'FORBIDDEN_ACCESS', message: 'No tienes los permisos necesarios para realizar esta acción.' },
      });
      return;
    }
    next();
  };

export const requireOwner = (request: Request, response: Response, next: NextFunction): void => {
  if (!request.user || request.user.role !== 'OWNER' || request.user.ownerId === null) {
    response.status(403).json({
      success: false,
      data: null,
      error: { code: 'OWNER_CONTEXT_REQUIRED', message: 'La cuenta no está vinculada a un propietario.' },
    });
    return;
  }
  next();
};
