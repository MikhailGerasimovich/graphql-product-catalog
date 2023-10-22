import { Basket } from '../../baskets/entities';

export class UpdateBasketProductInput {
  basket: Basket;
  productId?: number;
  productsPrice?: number;
  productsQuantity?: number;
}
