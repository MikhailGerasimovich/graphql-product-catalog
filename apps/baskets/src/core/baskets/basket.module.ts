import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BasketService } from './basket.service';
import { BasketResolver } from './basket.resolver';
import { Basket, BasketProduct } from './entities';
import { UserResolver } from './user.resolver';
import { BasketProductResolver } from './basket-product.resolver';
import { ProductResolver } from './product.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Basket, BasketProduct])],
  providers: [BasketService, BasketResolver, UserResolver, BasketProductResolver, ProductResolver],
})
export class BasketModule {}
