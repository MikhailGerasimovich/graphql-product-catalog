import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BasketProduct } from './entities';
import { BasketProductService } from './basket-product.service';
import { BasketProductResolver } from './basket-product.resolver';
import { ProductResolver } from './product.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([BasketProduct])],
  providers: [BasketProductService, BasketProductResolver, ProductResolver],
  exports: [BasketProductService],
})
export class BasketProductModule {}
