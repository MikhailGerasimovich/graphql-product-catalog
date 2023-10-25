import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OrderProduct } from './entities';

@Resolver('OrderProduct')
export class OrderProductResolver {
  @ResolveField('product')
  async product(@Parent() orderProduct: OrderProduct): Promise<any> {
    return { __typename: 'Product', id: orderProduct.productId };
  }
}
