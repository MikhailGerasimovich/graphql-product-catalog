import { Module } from '@nestjs/common';

import { BasketModule } from './baskets/basket.module';
import { BasketProductModule } from './basket-products/basket-product.module';

@Module({
  imports: [BasketModule, BasketProductModule],
})
export class CoreModule {}
