import { Module } from '@nestjs/common';

import { OrderModule } from './orders/order.module';
import { OrderProductModule } from './order-products/order-product.module';
import { PaymentModule } from './payment/payment.module';
import { StripeModule } from './stripe-payment/stripe.module';

@Module({
  imports: [OrderModule, OrderProductModule, PaymentModule, StripeModule],
})
export class CoreModule {}
