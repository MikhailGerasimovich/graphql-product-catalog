import { Product } from '../../../domain';

export class TakeProductEvent {
  constructor(public readonly product: Product) {}
}
