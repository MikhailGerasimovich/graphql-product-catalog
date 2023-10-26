import { Order } from '../../orders/entities';

export class CreateOrderProductInput {
  order: Order;
  productId: number;
  productQuantity: number;
  purchaseDate: string;
}
