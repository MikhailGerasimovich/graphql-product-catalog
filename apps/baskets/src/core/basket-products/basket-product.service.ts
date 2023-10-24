import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BasketProduct } from './entities';
import { CreateBasketProductInput, UpdateBasketProductInput } from './dto';
import { Basket } from '../baskets/entities';

@Injectable()
export class BasketProductService {
  constructor(@InjectRepository(BasketProduct) private readonly repository: Repository<BasketProduct>) {}

  async create(basket: Basket, productId: number): Promise<BasketProduct> {
    const createBasketProductInput = new CreateBasketProductInput();
    createBasketProductInput.basket = basket;
    createBasketProductInput.productId = productId;
    createBasketProductInput.productsPrice = 0;
    createBasketProductInput.productsQuantity = 0;

    const basketProductEntity = this.repository.create(createBasketProductInput);
    const basketProduct = await this.repository.save(basketProductEntity);
    return basketProduct;
  }

  async save(basketProduct: UpdateBasketProductInput): Promise<BasketProduct> {
    return await this.repository.save(basketProduct);
  }

  async delete(id: number) {
    await this.repository.delete(id);
  }

  async forProduct(productId: number): Promise<BasketProduct> {
    const basketProduct = await this.repository.findOne({
      where: { productId },
    });

    return basketProduct;
  }
}
