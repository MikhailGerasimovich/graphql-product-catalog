import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { QueryProductRepository } from '../../../infrastructure';
import { FindOneProductQuery } from '../impl';

@QueryHandler(FindOneProductQuery)
export class FindOneProductHandler implements IQueryHandler<FindOneProductQuery> {
  constructor(private readonly repository: QueryProductRepository) {}

  async execute(query: FindOneProductQuery): Promise<any> {
    const { productId } = query;
    const product = await this.repository.findOne(productId);
    return product;
  }
}
