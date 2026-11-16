import { describe, expect, it, jest } from '@jest/globals';
import { AuditService } from '../src/services/audit.service';
import { listAuditLogs } from '../src/controllers/audit.controller';

jest.mock('../src/services/audit.service', () => ({
  AuditService: { list: jest.fn() },
}));

const mockedList = jest.mocked(AuditService.list);

const response = () => {
  const result = { statusCode: 200, body: undefined as unknown };
  const responseMock = {
    status: jest.fn((statusCode: number) => {
      result.statusCode = statusCode;
      return responseMock;
    }),
    json: jest.fn((body: unknown) => {
      result.body = body;
      return responseMock;
    }),
  };
  return { responseMock, result };
};

describe('listAuditLogs controller', () => {
  it('rejects invalid limits before querying audit data', async () => {
    const { responseMock, result } = response();

    await listAuditLogs({ query: { limit: '201' } } as never, responseMock as never);

    expect(result.statusCode).toBe(400);
    expect(result.body).toMatchObject({ error: { code: 'INVALID_LIMIT' } });
    expect(mockedList).not.toHaveBeenCalled();
  });

  it('uses the requested limit and returns audit events', async () => {
    const { responseMock, result } = response();
    mockedList.mockResolvedValue([{ id: 1 }] as never);

    await listAuditLogs({ query: { limit: '25' } } as never, responseMock as never);

    expect(mockedList).toHaveBeenCalledWith(25);
    expect(result.body).toMatchObject({ success: true, data: [{ id: 1 }], error: null });
  });
});
