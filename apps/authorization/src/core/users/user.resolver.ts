import { Resolver, Query, Args, ResolveReference } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { FindUserInput } from './dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async findAllUsers(@Args('input', { nullable: true }) findUserInput: FindUserInput): Promise<User[]> {
    const users = await this.userService.findAll(findUserInput);
    return users;
  }

  @Query(() => User)
  async findOneUser(@Args('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.userService.findOne(id);
    return user;
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: number }): Promise<User> {
    return await this.userService.findOne(reference.id);
  }
}
