import { Resolver, Query, Args, ResolveReference } from '@nestjs/graphql';
import { ParseIntPipe, UseGuards } from '@nestjs/common';

import { GetPayload, JwtAuthGuard, Payload, Role, Roles, RolesGuard } from '@app/common';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { FindUserInput } from './dto';

@UseGuards(JwtAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => [User])
  async findAllUsers(@Args('input', { nullable: true }) findUserInput: FindUserInput): Promise<User[]> {
    const users = await this.userService.findAll(findUserInput);
    return users;
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => User)
  async findOneUser(@Args('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.userService.findOne(id);
    return user;
  }

  @Query(() => User)
  async findUser(@GetPayload() payload: Payload): Promise<User> {
    const user = await this.userService.findOne(payload.sub);
    return user;
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: number }): Promise<User> {
    return await this.userService.findOne(reference.id);
  }
}
