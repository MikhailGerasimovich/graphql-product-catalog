export function getBasketCacheKey(id?: number): string {
  const key = 'baskets';
  if (id) return key + id;
  return key;
}
