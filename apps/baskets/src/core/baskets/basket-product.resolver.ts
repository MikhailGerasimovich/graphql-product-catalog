import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { BasketProduct, User } from './entities';

@Resolver(() => BasketProduct)
export class BasketProductResolver {
  @ResolveField(() => User)
  async product(@Parent() basketProduct: BasketProduct): Promise<any> {
    return { __typename: 'User', id: basketProduct.productId };
  }
}
