import { Request, Response } from 'express';
import { PortalService } from '../services/portal.service';

export const getPortalDashboard = async (request: Request, response: Response): Promise<void> => {
  try {
    response.json({ success: true, data: await PortalService.getDashboard(request.user!.ownerId!), error: null });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'PORTAL_FAILED';
    response.status(code === 'OWNER_NOT_FOUND' ? 404 : 500).json({
      success: false,
      data: null,
      error: {
        code,
        message: code === 'OWNER_NOT_FOUND' ? 'El propietario no existe.' : 'No se pudo cargar el portal.',
      },
    });
  }
};
