import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BasketProduct } from './entities';
import { CreateBasketProductInput, UpdateBasketProductInput } from './dto';

@Injectable()
export class BasketProductService {
  constructor(@InjectRepository(BasketProduct) private readonly repository: Repository<BasketProduct>) {}

  async create(createBasketProductInput: CreateBasketProductInput): Promise<BasketProduct> {
    const basketProductEntity = this.repository.create(createBasketProductInput);
    const basketProduct = await this.repository.save(basketProductEntity);
    return basketProduct;
  }

  async update(id: number, updateBasketProductInput: UpdateBasketProductInput): Promise<BasketProduct> {
    const existingBasketProduct = await this.repository.findOne({ where: { id } });
    const basketProductEntity = this.repository.create(updateBasketProductInput);
    const updatedBasketProduct = await this.repository.save({
      ...existingBasketProduct,
      ...basketProductEntity,
    });
    return updatedBasketProduct;
  }

  async forProduct(productId: number): Promise<BasketProduct> {
    const basketProduct = await this.repository.findOne({
      where: { productId },
    });

    return basketProduct;
  }
}
