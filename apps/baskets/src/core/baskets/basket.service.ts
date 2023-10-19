import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Basket } from './entities';

@Injectable()
export class BasketService {
  constructor(@InjectRepository(Basket) private readonly basketRepository: Repository<Basket>) {}
  async forUser(userId: number): Promise<Basket> {
    const basket = await this.basketRepository.findOne({
      where: { userId },
      relations: ['basketProducts'],
    });

    return basket;
  }
}
