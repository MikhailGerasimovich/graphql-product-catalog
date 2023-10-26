import { IsArray, IsIn, IsNumber } from 'class-validator';

export class CreatePurchaseInput {
  @IsNumber({}, { each: true })
  @IsArray()
  basketProductId?: number[];

  // @IsIn(['paypal', 'stripe'])
  // paymentSystem: 'paypal' | 'stripe';
}
