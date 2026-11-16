import { NextFunction, Request, Response } from 'express';

const blockedKeys = new Set(['__proto__', 'prototype', 'constructor']);
const htmlTagPattern = /<\s*\/?\s*[a-z][^>]*>/i;

const containsBlockedKey = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') return false;
  return Object.entries(value).some(
    ([key, nestedValue]) =>
      blockedKeys.has(key) ||
      (typeof nestedValue === 'string' && htmlTagPattern.test(nestedValue)) ||
      containsBlockedKey(nestedValue),
  );
};

export const rejectUnsafeInput = (request: Request, response: Response, next: NextFunction): void => {
  if (containsBlockedKey(request.body) || containsBlockedKey(request.query) || containsBlockedKey(request.params)) {
    response.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_INPUT', message: 'La solicitud contiene campos no permitidos.' },
    });
    return;
  }
  next();
};
