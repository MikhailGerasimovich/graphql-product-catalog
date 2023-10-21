import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';

import { Payload, sendMessage } from '@app/common';

import { Basket } from './entities';
import { TakeProductInput } from './dto';
import { RmqClientName } from '../../common';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Basket) private readonly basketRepository: Repository<Basket>,
    @Inject(RmqClientName.Catalog) private readonly client: ClientProxy,
  ) {}

  async findOneByUserId(userId: number): Promise<Basket> {
    const basket = await this.basketRepository.findOne({
      where: { userId: userId },
      relations: ['basketProducts'],
    });

    return basket;
  }

  async takeProduct(takeProductInput: TakeProductInput, payload: Payload): Promise<Basket> {
    return null;
  }

  async putProduct(productId: number, payload: Payload): Promise<Basket> {
    return null;
  }

  private async sendMessageToCotalog<T>(pattern: string, data: any): Promise<T> {
    const response = await sendMessage<T>({ client: this.client, pattern, data });
    return response;
  }
}
