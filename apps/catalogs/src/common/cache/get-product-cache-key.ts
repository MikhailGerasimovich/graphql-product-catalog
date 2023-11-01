export function getProductCacheKey(id?: number): string {
  const key = 'products';
  if (id) return key + id;
  return key;
}
