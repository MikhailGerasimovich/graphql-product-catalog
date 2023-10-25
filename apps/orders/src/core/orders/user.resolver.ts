import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order, User } from './entities';

@Resolver('User')
export class UserResolver {
  constructor(private readonly orderService: OrderService) {}
  @ResolveField('order')
  async basket(@Parent() user: User): Promise<Order> {
    return await this.orderService.findOneByUserId(user.id);
  }
}
