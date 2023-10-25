import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { CreatePurchaseInput } from '../classes';
import { Order } from './entities';

@Resolver('Order')
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query('findUserOrder')
  async findUserOrder(@Args('input') userId: number): Promise<Order> {
    const order = await this.orderService.findOneByUserId(userId);
    return order;
  }

  @Query('findOrder')
  async findOrder(): Promise<Order> {
    return null;
  }

  @Mutation('purchase')
  async purchase(@Args('input') createPurchaseInput: CreatePurchaseInput) {}

  @ResolveField('user')
  async user(@Parent() order: Order): Promise<any> {
    return { __typename: 'User', id: order.userId };
  }
}
