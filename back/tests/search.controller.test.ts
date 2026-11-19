import { describe, expect, it, jest } from '@jest/globals';
import { SearchService } from '../src/services/search.service';
import { searchRecords } from '../src/controllers/search.controller';

jest.mock('../src/services/search.service', () => ({
  SearchService: { search: jest.fn() },
}));

const mockedSearch = jest.mocked(SearchService.search);

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

describe('searchRecords controller', () => {
  it('rejects queries outside the business limits', async () => {
    const { responseMock, result } = response();

    await searchRecords({ query: { q: 'a' } } as never, responseMock as never);

    expect(result.statusCode).toBe(400);
    expect(result.body).toMatchObject({ error: { code: 'INVALID_SEARCH_QUERY' } });
    expect(mockedSearch).not.toHaveBeenCalled();
  });

  it('returns combined owner and pet search results', async () => {
    const { responseMock, result } = response();
    mockedSearch.mockResolvedValue([{ type: 'PET', id: 2, title: 'Luna', subtitle: 'HP-2' }]);

    await searchRecords({ query: { q: ' Luna ' } } as never, responseMock as never);

    expect(result.body).toEqual({
      success: true,
      data: [{ type: 'PET', id: 2, title: 'Luna', subtitle: 'HP-2' }],
      error: null,
    });
    expect(mockedSearch).toHaveBeenCalledWith('Luna');
  });

  it('returns a controlled error when search persistence fails', async () => {
    const { responseMock, result } = response();
    mockedSearch.mockRejectedValue(new Error('database unavailable'));

    await searchRecords({ query: { q: 'Ana' } } as never, responseMock as never);

    expect(result.statusCode).toBe(500);
    expect(result.body).toMatchObject({ error: { code: 'SEARCH_FAILED' } });
  });

  it('rejects a search query that exceeds the maximum length', async () => {
    const { responseMock, result } = response();
    mockedSearch.mockClear();

    await searchRecords({ query: { q: 'a'.repeat(101) } } as never, responseMock as never);

    expect(result.statusCode).toBe(400);
    expect(mockedSearch).not.toHaveBeenCalled();
  });
});
