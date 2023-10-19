import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BasketService } from './basket.service';
import { BasketResolver } from './basket.resolver';
import { Basket, BasketProduct } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Basket, BasketProduct])],
  providers: [BasketService, BasketResolver],
})
export class BasketModule {}
