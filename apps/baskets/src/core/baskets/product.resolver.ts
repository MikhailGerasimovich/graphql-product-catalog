import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { BasketService } from './basket.service';
import { BasketProduct, Product } from './entities';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly basketService: BasketService) {}
  @ResolveField(() => BasketProduct)
  async basketProduct(@Parent() product: Product): Promise<BasketProduct> {
    return await this.basketService.forProduct(product.id);
  }
}
