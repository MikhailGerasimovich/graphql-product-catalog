import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BasketService } from './basket.service';
import { Basket } from './entities/basket.entity';

@Resolver(() => Basket)
export class BasketResolver {
  constructor(private readonly basketsService: BasketService) {}
}
