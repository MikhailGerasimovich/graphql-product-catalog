import { Like } from 'typeorm';

export function likeFilter<T>(entity: T) {
  const o = {};
  for (let [key, value] of Object.entries(entity)) {
    if (typeof value == 'string') {
      o[key] = Like(`%${value}%`);
      continue;
    }

    o[key] = value;
  }
  return o;
}
