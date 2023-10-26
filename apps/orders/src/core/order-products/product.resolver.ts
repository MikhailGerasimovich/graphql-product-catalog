import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OrderProductService } from './order-product.service';
import { OrderProduct, Product } from './entities';

@Resolver('Product')
export class ProductResolver {
  constructor(private readonly orderProductService: OrderProductService) {}
  @ResolveField('orderProduct')
  async orderProduct(@Parent() product: Product): Promise<OrderProduct> {
    return await this.orderProductService.forProduct(product.id);
  }
}
