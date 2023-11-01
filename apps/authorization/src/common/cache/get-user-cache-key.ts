export function getUserCacheKey(id?: number): string {
  const key = 'users';
  if (id) return key + id;
  return key;
}
