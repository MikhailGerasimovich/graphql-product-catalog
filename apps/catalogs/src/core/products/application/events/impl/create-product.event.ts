import { Product } from '../../../domain';

export class CreateProductEvent {
  constructor(public readonly product: Product) {}
}
