import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '@app/common';

import { Basket } from './entities';
import { BasketService } from './basket.service';
import { BasketResolver } from './basket.resolver';
import { UserResolver } from './user.resolver';
import { BasketProductModule } from '../basket-products/basket-product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Basket]), BasketProductModule],
  providers: [JwtStrategy, BasketService, BasketResolver, UserResolver],
})
export class BasketModule {}
