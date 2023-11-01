import { Module } from '@nestjs/common';

import { JwtStrategy, RedisModule } from '@app/common';

import { StripeModule } from '../stripe-payment/stripe.module';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { OrderModule } from '../orders/order.module';

@Module({
  imports: [StripeModule, OrderModule, RedisModule],
  providers: [JwtStrategy, PaymentService, PaymentResolver],
})
export class PaymentModule {}
