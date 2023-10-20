import { Resolver, ResolveField, Parent, Query, Mutation, Args } from '@nestjs/graphql';
import { ParseIntPipe, UseGuards } from '@nestjs/common';

import { GetPayload, JwtAuthGuard, Payload, Role, Roles } from '@app/common';

import { BasketService } from './basket.service';
import { Basket } from './entities/basket.entity';
import { User } from './entities';

// @UseGuards(JwtAuthGuard)
@Resolver(() => Basket)
export class BasketResolver {
  constructor(private readonly basketsService: BasketService) {}

  @Query(() => Basket)
  async findUserBasket(@Args('userId') userId: number): Promise<Basket> {
    const basket = await this.basketsService.forUser(userId);
    return basket;
  }

  @Query(() => Basket)
  async getBasket(@GetPayload() payload: Payload): Promise<Basket> {
    const basket = await this.basketsService.getBasket(payload);
    return basket;
  }

  @Mutation(() => Basket)
  async takeProduct(
    @Args('productId', ParseIntPipe) productId: number,
    @GetPayload() payload: Payload,
  ): Promise<Basket> {
    const basket = await this.basketsService.takeProduct(productId, payload);
    return basket;
  }

  @Mutation(() => Basket)
  async putProduct(
    @Args('productId', ParseIntPipe) productId: number,
    @GetPayload() payload: Payload,
  ): Promise<Basket> {
    const basket = await this.basketsService.putProduct(productId, payload);
    return basket;
  }

  @ResolveField(() => User)
  async user(@Parent() basket: Basket): Promise<any> {
    return { __typename: 'User', id: basket.userId };
  }
}
