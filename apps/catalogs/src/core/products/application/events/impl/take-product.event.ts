import { ResponseTakeProductInfo } from '@app/common';

export class TakeProductEvent {
  constructor(public readonly resTakeProduct: ResponseTakeProductInfo) {}
}
