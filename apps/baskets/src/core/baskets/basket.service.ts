import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Basket, BasketProduct } from './entities';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Basket) private readonly basketRepository: Repository<Basket>,
    @InjectRepository(BasketProduct) private readonly basketProductRepository: Repository<BasketProduct>,
  ) {}
  async forUser(userId: number): Promise<Basket> {
    const basket = await this.basketRepository.findOne({
      where: { userId },
      relations: ['basketProducts'],
    });

    return basket;
  }

  async forProduct(productId: number): Promise<BasketProduct> {
    const basketProduct = await this.basketProductRepository.findOne({
      where: { productId },
    });

    return basketProduct;
  }
}
