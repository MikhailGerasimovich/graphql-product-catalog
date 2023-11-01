import { Resolver, Query, Args, ResolveReference } from '@nestjs/graphql';
import { ParseIntPipe, UseGuards } from '@nestjs/common';

import { GetPayload, JwtAuthGuard, Payload, RedisService, Role, Roles, RolesGuard } from '@app/common';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { FindUserInput } from './dto';
import { getUserCacheKey } from '../../common';

@UseGuards(JwtAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly cache: RedisService,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => [User])
  async findAllUsers(@Args('input', { nullable: true }) findUserInput: FindUserInput): Promise<User[]> {
    const key = getUserCacheKey();
    const fromCache = await this.cache.get(key);
    if (fromCache) {
      return fromCache;
    }

    const users = await this.userService.findAll(findUserInput);
    await this.cache.set(key, users);
    return users;
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => User)
  async findOneUser(@Args('id', ParseIntPipe) id: number): Promise<User> {
    const key = getUserCacheKey(id);
    const fromCache = await this.cache.get(key);
    if (fromCache) {
      return fromCache;
    }
    const user = await this.userService.findOne(id);
    await this.cache.set(key, user);
    return user;
  }

  @Query(() => User)
  async findUser(@GetPayload() payload: Payload): Promise<User> {
    const key = getUserCacheKey(payload.sub);
    const fromCache = await this.cache.get(key);
    if (fromCache) {
      return fromCache;
    }
    const user = await this.userService.findOne(payload.sub);
    await this.cache.set(key, user);
    return user;
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: number }): Promise<User> {
    return await this.userService.findOne(reference.id);
  }
}
