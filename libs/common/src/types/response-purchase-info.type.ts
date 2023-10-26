//for payment services
class ProductsInfo {
  productId: number;
  productTitle: string;
  productsPrice: number;
  productQuantity: number;
}

export class ResponsePurchaseInfo {
  totalPrice: number;
  currency: string;
  products: ProductsInfo[] = [];
}
