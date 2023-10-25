import { Module } from '@nestjs/common';

import { OrderModule } from './orders/order.module';
import { OrderProductModule } from './order-products/order-product.module';

@Module({
  imports: [OrderModule, OrderProductModule],
})
export class CoreModule {}
