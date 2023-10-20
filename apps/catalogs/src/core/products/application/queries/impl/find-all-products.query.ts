import { FindProductInput } from '../../dto';

export class FindAllProductsQuery {
  constructor(public readonly findProductInput: FindProductInput) {}
}
