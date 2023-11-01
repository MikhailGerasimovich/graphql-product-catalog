export function getOrderCacheKey(id?: number): string {
  const key = 'orders';
  if (id) return key + id;
  return key;
}
