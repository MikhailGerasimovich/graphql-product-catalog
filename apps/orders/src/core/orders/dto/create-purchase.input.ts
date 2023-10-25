import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePurchaseInput {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
