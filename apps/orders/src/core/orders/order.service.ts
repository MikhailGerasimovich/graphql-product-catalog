import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>) {}

  async findOneByUserId(userId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { userId: userId },
      relations: ['orderProducts'],
    });
    return order;
  }
}
