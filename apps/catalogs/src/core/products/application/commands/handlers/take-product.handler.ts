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

    const isAvailable = product && product.quantity > 0 && product.quantity >= productQuantity;
    if (!isAvailable) {
      const resTakeProduct = this.notAvailable(productId);
      return { responseTakeProductInfo: resTakeProduct };
    }

    const resTakeProduct = this.available(product, productQuantity);

    const newProductQuantity = product.quantity - productQuantity;
    const updatedProduct = await this.repository.update(product.id, { quantity: newProductQuantity });

    return { responseTakeProductInfo: resTakeProduct, updatedProduct };
  }

  available(product: CommandProduct, productQuantity: number): ResponseTakeProductInfo {
    const resTakeProduct = new ResponseTakeProductInfo();
    resTakeProduct.isAvailable = true;
    resTakeProduct.priductQuantity = productQuantity;
    resTakeProduct.productId = product.id;
    resTakeProduct.productPrice = product.price;
    return resTakeProduct;
  }

  notAvailable(productId: number): ResponseTakeProductInfo {
    const resTakeProduct = new ResponseTakeProductInfo();
    resTakeProduct.isAvailable = false;
    resTakeProduct.priductQuantity = 0;
    resTakeProduct.productId = 0;
    resTakeProduct.productPrice = 0;
    return resTakeProduct;
  }
}
