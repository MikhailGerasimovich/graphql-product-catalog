import { GetPayload, JwtAuthGuard, Payload } from '@app/common';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { PaymentService } from './payment.service';
import { CreatePurchaseInput } from './dto';

@UseGuards(JwtAuthGuard)
@Resolver('Payment')
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation('purchase')
  async purchase(@Args('input') createPurchaseInput: CreatePurchaseInput, @GetPayload() payload: Payload) {
    const url = await this.paymentService.purchase(createPurchaseInput, payload);
    return url;
  }
}
