import { Resolver, ResolveField, Parent, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';

import {
  GetPayload,
  JwtAuthGuard,
  Payload,
  RedisService,
  Role,
  Roles,
  RolesGuard,
  TransactionInterceptor,
} from '@app/common';

import { BasketService } from './basket.service';
import { Basket } from './entities/basket.entity';
import { User } from './entities';
import { PutProductInput, TakeProductInput } from './dto';
import { getBasketCacheKey } from '../../common';

@UseGuards(JwtAuthGuard)
@Resolver(() => Basket)
export class BasketResolver {
  constructor(
    private readonly basketsService: BasketService,
    private readonly cache: RedisService,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Basket, { nullable: true })
  async findUserBasket(@Args('userId') userId: number): Promise<Basket> {
    const key = getBasketCacheKey(userId);
    const fromCache = await this.cache.get(key);
    if (fromCache) {
      return fromCache;
    }
    const basket = await this.basketsService.findOneByUserId(userId);
    await this.cache.set(key, basket);
    return basket;
  }

  @Query(() => Basket, { nullable: true })
  async findBasket(@GetPayload() payload: Payload): Promise<Basket> {
    const key = getBasketCacheKey(payload.sub);
    const fromCache = await this.cache.get(key);
    if (fromCache) {
      return fromCache;
    }
    const basket = await this.basketsService.findOneByUserId(payload.sub);
    await this.cache.set(key, basket);
    return basket;
  }

  @UseInterceptors(TransactionInterceptor)
  @Mutation(() => Basket)
  async takeProduct(
    @Args('input') takeProductInput: TakeProductInput,
    @GetPayload() payload: Payload,
  ): Promise<Basket> {
    await this.cache.del(getBasketCacheKey(payload.sub));
    const basket = await this.basketsService.takeProduct(takeProductInput, payload);
    return basket;
  }

  @UseInterceptors(TransactionInterceptor)
  @Mutation(() => Basket)
  async putProduct(
    @Args('input') putProductInput: PutProductInput,
    @GetPayload() payload: Payload,
  ): Promise<Basket> {
    await this.cache.del(getBasketCacheKey(payload.sub));
    const basket = await this.basketsService.putProduct(putProductInput, payload);
    return basket;
  }

  @ResolveField(() => User)
  async user(@Parent() basket: Basket): Promise<any> {
    return { __typename: 'User', id: basket.userId };
  }
}
