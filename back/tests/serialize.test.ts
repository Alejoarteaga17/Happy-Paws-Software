import { serialize } from '../src/utils/serialize';

test('serializes bigint identifiers for JSON responses', () => {
  expect(serialize({ id: 12n })).toEqual({ id: '12' });
});
