import { Order } from '../../orders/entities';

export class UpdateOrderProductInput {
  order?: Order;
  productId?: number;
  productQuantity?: number;
  purchaseDate?: string;
}
