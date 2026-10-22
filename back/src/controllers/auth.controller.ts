import { Request, Response } from 'express';

export const getCurrentUser = (request: Request, response: Response): void => {
  response.json({ success: true, data: request.user, error: null });
};
