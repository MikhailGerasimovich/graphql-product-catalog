import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { GetPayload, JwtAuthGuard, Payload } from '@app/common';

import { OrderService } from './order.service';
import { Order } from './entities';

@Resolver('Order')
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query('findUserOrder')
  async findUserOrder(@Args('input') userId: number): Promise<Order> {
    const order = await this.orderService.findOneByUserId(userId);
    return order;
  }

  @UseGuards(JwtAuthGuard)
  @Query('findOrder')
  async findOrder(@GetPayload() payload: Payload): Promise<Order> {
    const order = await this.orderService.findOneByUserId(payload.sub);
    return order;
  }

  @ResolveField('user')
  async user(@Parent() order: Order): Promise<any> {
    return { __typename: 'User', id: order.userId };
  }
}
