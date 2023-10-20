import { Resolver, ResolveField, Parent } from '@nestjs/graphql';

import { BasketProduct, Product } from './entities';

@Resolver(() => BasketProduct)
export class BasketProductResolver {
  @ResolveField(() => Product)
  async product(@Parent() basketProduct: BasketProduct): Promise<any> {
    return { __typename: 'Product', id: basketProduct.productId };
  }
}
