import { RequestTakeProductInfo } from '@app/common';

export class TakeProductCommand {
  constructor(public readonly reqTakeProduct: RequestTakeProductInfo) {}
}
