import { IsArray, IsNumber } from 'class-validator';

export class CreatePurchaseInput {
  @IsNumber({}, { each: true })
  @IsArray()
  basketProductId?: number[];
}
