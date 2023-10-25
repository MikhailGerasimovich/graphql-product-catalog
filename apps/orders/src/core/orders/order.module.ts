import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrderService, OrderResolver, UserResolver],
})
export class OrderModule {}
