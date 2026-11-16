import { describe, expect, it, jest } from '@jest/globals';
import { rejectUnsafeInput } from '../src/middlewares/input-security.middleware';

const response = () => {
  const responseMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return responseMock;
};

describe('rejectUnsafeInput', () => {
  it('rejects prototype-pollution keys and HTML markup in request bodies', () => {
    const responseMock = response();
    const next = jest.fn();

    rejectUnsafeInput(
      { body: { constructor: { role: 'ADMIN' }, notes: '<script>alert(1)</script>' }, query: {}, params: {} } as never,
      responseMock as never,
      next,
    );

    expect(responseMock.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows ordinary validated request data', () => {
    const responseMock = response();
    const next = jest.fn();

    rejectUnsafeInput({ body: { fullName: 'Ana' }, query: {}, params: {} } as never, responseMock as never, next);

    expect(next).toHaveBeenCalled();
  });
});
