import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { QueryProductRepository } from '../../../infrastructure';
import { FindAllProductsQuery } from '../impl';

@QueryHandler(FindAllProductsQuery)
export class FindAllProductsHandler implements IQueryHandler<FindAllProductsQuery> {
  constructor(private readonly repository: QueryProductRepository) {}
  async execute(query: FindAllProductsQuery): Promise<any> {
    const { findProductInput } = query;
    const products = await this.repository.findAll(findProductInput);
    return products;
  }
}
