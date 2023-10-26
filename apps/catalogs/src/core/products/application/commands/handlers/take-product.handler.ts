import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommandProductRepository } from '../../../infrastructure';
import { TakeProductCommand } from '../impl';
import { CommandProduct } from '../../../domain';

import { ResponseTakeProductInfo } from '@app/common';

@CommandHandler(TakeProductCommand)
export class TakeProductHandler implements ICommandHandler<TakeProductCommand> {
  constructor(private readonly repository: CommandProductRepository) {}

  async execute(command: TakeProductCommand): Promise<any> {
    const { reqTakeProduct } = command;
    const { productId, productQuantity } = reqTakeProduct;

    const product = await this.repository.findOne(productId);

    const isAvailable = product && product.inStock;
    if (!isAvailable) {
      const resTakeProduct = this.notAvailable(productId);
      return resTakeProduct;
    }

    const resTakeProduct = this.available(product, productQuantity);
    return resTakeProduct;
  }

  available(product: CommandProduct, productQuantity: number): ResponseTakeProductInfo {
    const resTakeProduct = new ResponseTakeProductInfo();
    resTakeProduct.isAvailable = true;
    resTakeProduct.priductQuantity = productQuantity;
    resTakeProduct.productId = product.id;
    resTakeProduct.productTitle = product.title;
    resTakeProduct.productPrice = product.price;
    return resTakeProduct;
  }

  notAvailable(productId: number): ResponseTakeProductInfo {
    const resTakeProduct = new ResponseTakeProductInfo();
    resTakeProduct.isAvailable = false;
    resTakeProduct.priductQuantity = 0;
    resTakeProduct.productId = productId;
    resTakeProduct.productTitle = 'unavailable';
    resTakeProduct.productPrice = 0;
    return resTakeProduct;
  }
}
