import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BasketsService } from './baskets.service';
import { Basket } from './entities/basket.entity';

@Resolver(() => Basket)
export class BasketsResolver {
  constructor(private readonly basketsService: BasketsService) {}
}
