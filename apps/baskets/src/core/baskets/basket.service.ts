import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payload } from '@app/common';

import { Basket } from './entities';

@Injectable()
export class BasketService {
  constructor(@InjectRepository(Basket) private readonly basketRepository: Repository<Basket>) {}

  async getBasket(payload: Payload): Promise<Basket> {
    const userId = 4;

    const basket = await this.basketRepository.findOne({
      where: { userId: userId },
      relations: ['basketProducts'],
    });

    return basket;
  }

  async takeProduct(productId: number, payload: Payload): Promise<Basket> {
    return null;
  }

  async putProduct(productId: number, payload: Payload): Promise<Basket> {
    return null;
  }

  async forUser(userId: number): Promise<Basket> {
    const basket = await this.basketRepository.findOne({
      where: { userId },
      relations: ['basketProducts'],
    });

    return basket;
  }
}
