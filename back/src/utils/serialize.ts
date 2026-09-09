export function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (_key: string, item: unknown) => typeof item === 'bigint' ? item.toString() : item)) as T;
}
