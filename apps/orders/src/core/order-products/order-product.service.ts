import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProduct } from './entities';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct) private readonly orderProductRepository: Repository<OrderProduct>,
  ) {}

  async forProduct(productId: number): Promise<OrderProduct> {
    const orderProduct = await this.orderProductRepository.findOne({
      where: { productId },
    });
    return orderProduct;
  }
}
