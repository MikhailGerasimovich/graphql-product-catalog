import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy, RedisModule } from '@app/common';

import { Order } from './entities';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { UserResolver } from './user.resolver';
import { OrderProductModule } from '../order-products/order-product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), OrderProductModule, RedisModule],
  providers: [JwtStrategy, OrderService, OrderResolver, UserResolver],
  exports: [OrderService],
})
export class OrderModule {}
