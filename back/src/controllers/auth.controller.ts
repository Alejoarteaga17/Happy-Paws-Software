import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';

export const getCurrentUser = (request: Request, response: Response): void => {
  response.json({ success: true, data: request.user, error: null });
};

export const auditLogin = async (request: Request, response: Response): Promise<void> => {
  try {
    await AuditService.record({
      actorUserId: request.user!.id,
      action: 'LOGIN',
      entityName: 'auth',
      entityId: request.user!.id,
    });
    response.json({ success: true, data: null, error: null });
  } catch {
    response.status(500).json({
      success: false,
      data: null,
      error: { code: 'LOGIN_AUDIT_FAILED', message: 'No se pudo registrar el inicio de sesión.' },
    });
  }
};
