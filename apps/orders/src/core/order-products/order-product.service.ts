import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProduct } from './entities';
import { CreateOrderProductInput, UpdateOrderProductInput } from './dto';

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

  async createMany(createOrderProductInput: CreateOrderProductInput[]): Promise<OrderProduct[]> {
    const orderProductEntities = this.orderProductRepository.create(createOrderProductInput);
    const orderProducts = await this.orderProductRepository.save(orderProductEntities);
    return orderProducts;
  }

  async save(updateOrderProductInput: UpdateOrderProductInput[]): Promise<OrderProduct[]> {
    return await this.orderProductRepository.save(updateOrderProductInput);
  }
}
