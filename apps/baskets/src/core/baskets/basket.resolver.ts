import { Resolver, ResolveField, Parent, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';

import { GetPayload, JwtAuthGuard, Payload, Role, Roles, TransactionInterceptor } from '@app/common';

import { BasketService } from './basket.service';
import { Basket } from './entities/basket.entity';
import { User } from './entities';
import { PutProductInput, TakeProductInput } from './dto';

@UseGuards(JwtAuthGuard)
@Resolver(() => Basket)
export class BasketResolver {
  constructor(private readonly basketsService: BasketService) {}

  // @Roles(Role.ADMIN)
  @Query(() => Basket)
  async findUserBasket(@Args('userId') userId: number): Promise<Basket> {
    const basket = await this.basketsService.findOneByUserId(userId);
    return basket;
  }

  @Query(() => Basket)
  async findBasket(@GetPayload() payload: Payload): Promise<Basket> {
    const basket = await this.basketsService.findOneByUserId(payload.sub);
    return basket;
  }

  @UseInterceptors(TransactionInterceptor)
  @Mutation(() => Basket)
  async takeProduct(
    @Args('input') takeProductInput: TakeProductInput,
    @GetPayload() payload: Payload,
  ): Promise<Basket> {
    const basket = await this.basketsService.takeProduct(takeProductInput, payload);
    return basket;
  }

  @UseInterceptors(TransactionInterceptor)
  @Mutation(() => Basket)
  async putProduct(
    @Args('input') putProductInput: PutProductInput,
    @GetPayload() payload: Payload,
  ): Promise<Basket> {
    const basket = await this.basketsService.putProduct(putProductInput, payload);
    return basket;
  }

  @ResolveField(() => User)
  async user(@Parent() basket: Basket): Promise<any> {
    return { __typename: 'User', id: basket.userId };
  }
}
