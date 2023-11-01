import { GetPayload, JwtAuthGuard, Payload, RedisService } from '@app/common';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { PaymentService } from './payment.service';
import { CreatePurchaseInput } from './dto';
import { getOrderCacheKey } from '../../common';

@UseGuards(JwtAuthGuard)
@Resolver('Payment')
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly cache: RedisService,
  ) {}

  @Mutation('purchase')
  async purchase(@Args('input') createPurchaseInput: CreatePurchaseInput, @GetPayload() payload: Payload) {
    await this.cache.del(getOrderCacheKey(payload.sub));
    const url = await this.paymentService.purchase(createPurchaseInput, payload);
    return url;
  }
}
