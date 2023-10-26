import { Basket } from '../../baskets/entities';

export class CreateBasketProductInput {
  basket: Basket;
  productId: number;
  productTitle: string;
  productsPrice: number;
  productQuantity: number;
}
