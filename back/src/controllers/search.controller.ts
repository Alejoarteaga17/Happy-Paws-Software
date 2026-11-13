import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';

export const searchRecords = async (request: Request, response: Response): Promise<void> => {
  const query = typeof request.query.q === 'string' ? request.query.q.trim() : '';
  if (query.length < 2 || query.length > 100) {
    response.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_SEARCH_QUERY', message: 'La búsqueda debe tener entre 2 y 100 caracteres.' },
    });
    return;
  }
  try {
    response.json({ success: true, data: await SearchService.search(query), error: null });
  } catch {
    response.status(500).json({
      success: false,
      data: null,
      error: { code: 'SEARCH_FAILED', message: 'No se pudo completar la búsqueda.' },
    });
  }
};
