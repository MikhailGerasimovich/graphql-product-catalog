import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BasketProduct } from './entities';

@Injectable()
export class BasketProductService {
  constructor(
    @InjectRepository(BasketProduct) private readonly basketProductRepository: Repository<BasketProduct>,
  ) {}

  async forProduct(productId: number): Promise<BasketProduct> {
    const basketProduct = await this.basketProductRepository.findOne({
      where: { productId },
    });

    return basketProduct;
  }
}
