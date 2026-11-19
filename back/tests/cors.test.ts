import { describe, expect, it } from '@jest/globals';
import { corsOptions } from '../src/config/cors';

type OriginValidator = (origin: string | undefined, callback: (error: Error | null, allowed?: boolean) => void) => void;

const resolveOrigin = (origin?: string) =>
  new Promise<{ error: Error | null; allowed: boolean | undefined }>((resolve) => {
    (corsOptions.origin as OriginValidator)(origin, (error, allowed) => resolve({ error, allowed }));
  });

describe('CORS policy', () => {
  it('allows the configured local frontend origin', async () => {
    await expect(resolveOrigin('http://localhost:3000')).resolves.toEqual({ error: null, allowed: true });
  });

  it('allows requests without an Origin header', async () => {
    await expect(resolveOrigin()).resolves.toEqual({ error: null, allowed: true });
  });

  it('rejects origins outside the configured allowlist', async () => {
    const result = await resolveOrigin('https://malicious.example');

    expect(result.allowed).toBeUndefined();
    expect(result.error).toEqual(new Error('CORS origin not allowed'));
  });
});
