import { Controller } from '@nestjs/common';
import { BasketService } from './basket.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ResponsePurchaseInfo, RequestPurchaseInfo, Pattern } from '@app/common';

@Controller()
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @MessagePattern(Pattern.PurchaseProduct)
  async toPurchase(@Payload() reqPurchaseInfo: RequestPurchaseInfo): Promise<ResponsePurchaseInfo> {
    const resPurchaseInfo = await this.basketService.toPurchase(reqPurchaseInfo);
    return resPurchaseInfo;
  }
}
