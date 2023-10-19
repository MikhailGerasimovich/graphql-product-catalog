import { Resolver, ResolveField, Parent } from '@nestjs/graphql';

import { BasketService } from './basket.service';
import { Basket } from './entities/basket.entity';
import { User } from './entities';

@Resolver(() => Basket)
export class BasketResolver {
  constructor(private readonly basketsService: BasketService) {}

  @ResolveField(() => User)
  async user(@Parent() basket: Basket): Promise<any> {
    return { __typename: 'User', id: basket.userId };
  }
}
