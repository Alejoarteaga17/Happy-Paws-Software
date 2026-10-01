import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';

export const listAuditLogs = async (request: Request, response: Response): Promise<void> => {
  const limit = request.query.limit ? Number(request.query.limit) : 100;
  if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
    response.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_LIMIT', message: 'El límite debe estar entre 1 y 200.' },
    });
    return;
  }
  try {
    response.json({ success: true, data: await AuditService.list(limit), error: null });
  } catch {
    response.status(500).json({
      success: false,
      data: null,
      error: { code: 'AUDIT_LIST_FAILED', message: 'No se pudieron cargar los eventos.' },
    });
  }
};
