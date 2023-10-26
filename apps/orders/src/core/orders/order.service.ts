import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResponsePurchaseInfo } from '@app/common';

import { Order } from './entities';
import { CreateOrderinput } from './dto';
import { OrderProductService } from '../order-products/order-product.service';
import { CreateOrderProductInput } from '../order-products/dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    private readonly orderProductService: OrderProductService,
  ) {}

  async findOneByUserId(userId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { userId: userId },
      relations: ['orderProducts'],
    });
    return order;
  }

  async create(resPurchaseInfo: ResponsePurchaseInfo, userId: number) {
    const order = await this.findByUserIdOrCreate(userId);
    if (!order.orderProducts) {
      order.orderProducts = [];
    }

    const createOrderProductInputs = resPurchaseInfo.products.map((p) =>
      this.createOrderProduct(order, p.productId, p.productQuantity),
    );

    const orderProducts = await this.orderProductService.createMany(createOrderProductInputs);

    order.orderProducts.push(...orderProducts);
    order.totalSpendMoney += resPurchaseInfo.totalPrice;
    await this.orderProductService.save(orderProducts);
    return await this.orderRepository.save(order);
  }

  private createOrderProduct(order: Order, productId: number, productQuantity: number) {
    const createOrderProductInput = new CreateOrderProductInput();
    createOrderProductInput.order = order;
    createOrderProductInput.productId = productId;
    createOrderProductInput.productQuantity = productQuantity;
    createOrderProductInput.purchaseDate = '26-10-2023 12:12:12';
    return createOrderProductInput;
  }

  private async findByUserIdOrCreate(userId: number): Promise<Order> {
    const existingOrder = await this.orderRepository.findOne({
      where: { userId: userId },
      relations: ['orderProducts'],
    });

    if (existingOrder) {
      return existingOrder;
    }

    const createOrderInput = new CreateOrderinput();
    createOrderInput.userId = userId;
    createOrderInput.totalSpendMoney = 0;

    const orderEntity = this.orderRepository.create(createOrderInput);
    const order = await this.orderRepository.save(orderEntity);
    return order;
  }
}
