import { Pattern, Payload, RequestPurchaseInfo, ResponsePurchaseInfo, sendMessage } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { RmqClientName } from '../../common';
import { StripeService } from '../stripe-payment/stripe.service';
import { OrderService } from '../orders/order.service';
import { CreatePurchaseInput } from './dto';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(RmqClientName.Basket) private readonly client: ClientProxy,
    private readonly stripeService: StripeService,
    private readonly orderService: OrderService,
  ) {}

  async purchase(createPurchaseInput: CreatePurchaseInput, payload: Payload): Promise<any> {
    const reqPurchaseInfo = this.createRequestPurchaseInfo(createPurchaseInput, payload.sub);
    const resPurchaseInfo = await this.sendMessageToBasket<ResponsePurchaseInfo>(
      Pattern.PurchaseProduct,
      reqPurchaseInfo,
    );

    const url = await this.stripeService.createCheckoutSession(resPurchaseInfo);
    await this.orderService.create(resPurchaseInfo, payload.sub);
    return url;
  }

  private createRequestPurchaseInfo(
    createPurchaseInput: CreatePurchaseInput,
    userId: number,
  ): RequestPurchaseInfo {
    const reqPurchaseInfo = new RequestPurchaseInfo();
    reqPurchaseInfo.userId = userId;
    reqPurchaseInfo.basketProductId = createPurchaseInput.basketProductId;
    return reqPurchaseInfo;
  }

  private async sendMessageToBasket<T>(pattern: string, data: any): Promise<T> {
    const response = await sendMessage<T>({ client: this.client, pattern, data });
    return response;
  }
}
