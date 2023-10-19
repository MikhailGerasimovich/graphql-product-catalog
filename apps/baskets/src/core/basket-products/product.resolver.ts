import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { BasketProductService } from './basket-product.service';
import { BasketProduct, Product } from './entities';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly basketProductService: BasketProductService) {}
  @ResolveField(() => BasketProduct)
  async basketProduct(@Parent() product: Product): Promise<BasketProduct> {
    return await this.basketProductService.forProduct(product.id);
  }
}
