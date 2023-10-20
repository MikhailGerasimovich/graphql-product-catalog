import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { BasketService } from './basket.service';
import { Basket, User } from './entities';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly basketService: BasketService) {}
  @ResolveField(() => Basket)
  async basket(@Parent() user: User): Promise<Basket> {
    return await this.basketService.forUser(user.id);
  }
}
