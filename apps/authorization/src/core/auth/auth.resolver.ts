import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Response } from 'express';

import {
  Cookie,
  GetPayload,
  GetTransaction,
  JwtAuthGuard,
  Payload,
  RedisService,
  TransactionInterceptor,
  setCookie,
} from '@app/common';

import { User } from '../users/entities';
import { AuthService } from './auth.service';
import { ChangePasswordInput, SignInInput, SignUpInput } from './dto';
import { JwtResponse } from './response';
import { LocalAuthGuard, RefreshJwtsGuard } from './guards';
import { GetToken } from './decorators';
import { getUserCacheKey } from '../../common';

@Resolver(() => JwtResponse)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly cache: RedisService,
  ) {}

  @UseInterceptors(TransactionInterceptor)
  @Mutation(() => Boolean, { nullable: true })
  async signUp(
    @Args('input') input: SignUpInput,
    @GetTransaction() t: EntityManager,
    @Context('res') res: Response,
  ): Promise<void> {
    await this.cache.del(getUserCacheKey());
    const jwts = await this.authService.signUp(input, t);
    setCookie(res, Cookie.Auth, jwts);
  }

  @UseGuards(LocalAuthGuard)
  @Mutation(() => Boolean, { nullable: true })
  async signIn(
    @Args('input') input: SignInInput,
    @GetPayload() user: User,
    @Context('res') res: Response,
  ): Promise<void> {
    const jwts = await this.authService.signIn(user);
    setCookie(res, Cookie.Auth, jwts);
  }

  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { nullable: true })
  async changePassword(
    @Args('input') input: ChangePasswordInput,
    @GetPayload() payload: Payload,
    @GetTransaction() t: EntityManager,
    @Context('res') res: Response,
  ): Promise<void> {
    await this.cache.del(getUserCacheKey(payload.sub));
    const jwts = await this.authService.changePassword(payload, input, t);
    setCookie(res, Cookie.Auth, jwts);
  }

  @UseGuards(RefreshJwtsGuard)
  @Mutation(() => Boolean, { nullable: true })
  async logout(
    @GetPayload() payload: Payload,
    @GetToken() refreshToken: string,
    @Context('res') res: Response,
  ): Promise<void> {
    await this.authService.logout(payload, refreshToken);
    setCookie(res, Cookie.Auth, null);
  }

  @UseGuards(RefreshJwtsGuard)
  @Mutation(() => Boolean, { nullable: true })
  async refreshTokens(
    @GetPayload() payload: Payload,
    @GetToken() refreshToken: string,
    @Context('res') res: Response,
  ): Promise<void> {
    const jwts = await this.authService.refreshTokens(payload, refreshToken);
    setCookie(res, Cookie.Auth, jwts);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { nullable: true })
  async logoutFromAllDevices(@GetPayload() payload: Payload): Promise<void> {
    await this.authService.logoutFromAllDevices(payload);
  }
}
