import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderProduct } from './entities';
import { OrderProductService } from './order-product.service';
import { ProductResolver } from './product.resolver';
import { OrderProductResolver } from './order-product.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProduct])],
  providers: [OrderProductService, OrderProductResolver, ProductResolver],
  exports: [OrderProductService],
})
export class OrderProductModule {}
