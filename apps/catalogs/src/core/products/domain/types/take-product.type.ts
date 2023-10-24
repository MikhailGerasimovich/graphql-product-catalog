import { ResponseTakeProductInfo } from '@app/common';
import { Product } from '../entities';

export class TakeProduct {
  responseTakeProductInfo: ResponseTakeProductInfo;
  updatedProduct?: Product;
}
