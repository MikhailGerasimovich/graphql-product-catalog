import { Product } from '../../../domain';

export class UpdateProductEvent {
  constructor(public readonly product: Product) {}
}
