import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BasketsService } from './baskets.service';
import { BasketsResolver } from './baskets.resolver';
import { Basket, BasketProduct } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Basket, BasketProduct])],
  providers: [BasketsService, BasketsResolver],
})
export class BasketsModule {}
