import { Basket } from '../../baskets/entities';

export class CreateBasketProductInput {
  basket: Basket;
  productId: number;
  productsPrice: number;
  productsQuantity: number;
}
