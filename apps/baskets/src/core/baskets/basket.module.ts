import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy, RedisModule } from '@app/common';

import { Basket } from './entities';
import { BasketService } from './basket.service';
import { BasketResolver } from './basket.resolver';
import { UserResolver } from './user.resolver';
import { BasketProductModule } from '../basket-products/basket-product.module';
import { BasketController } from './basket.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Basket]), BasketProductModule, RedisModule],
  providers: [JwtStrategy, BasketService, BasketResolver, UserResolver],
  controllers: [BasketController],
})
export class BasketModule {}
