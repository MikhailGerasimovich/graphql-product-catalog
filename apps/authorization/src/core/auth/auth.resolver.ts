import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { GetPayload, GetTransaction, JwtAuthGuard, Payload, TransactionInterceptor } from '@app/common';

import { User } from '../users/entities';
import { AuthService } from './auth.service';
import { ChangePasswordInput, SignInInput, SignUpInput } from './dto';
import { JwtResponse } from './response';
import { LocalAuthGuard, RefreshJwtsGuard } from './guards';
import { GetToken } from './decorators';

@Resolver(() => JwtResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(TransactionInterceptor)
  @Mutation(() => JwtResponse)
  async signUp(@Args('input') input: SignUpInput, @GetTransaction() t: EntityManager): Promise<JwtResponse> {
    const jwts = await this.authService.signUp(input, t);
    return jwts;
  }

  @UseGuards(LocalAuthGuard)
  @Mutation(() => JwtResponse)
  async signIn(@Args('input') input: SignInInput, @GetPayload() user: User): Promise<JwtResponse> {
    const jwts = await this.authService.signIn(user);
    return jwts;
  }

  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => JwtResponse)
  async changePassword(
    @Args('input') input: ChangePasswordInput,
    @GetPayload() payload: Payload,
    @GetTransaction() t: EntityManager,
  ): Promise<JwtResponse> {
    const jwts = await this.authService.changePassword(payload, input, t);
    return jwts;
  }

  @UseGuards(RefreshJwtsGuard)
  @Mutation(() => Boolean)
  async logout(@GetPayload() payload: Payload, @GetToken() refreshToken: string): Promise<boolean> {
    await this.authService.logout(payload, refreshToken);
    return true;
  }

  @UseGuards(RefreshJwtsGuard)
  @Mutation(() => JwtResponse)
  async refreshTokens(
    @GetPayload() payload: Payload,
    @GetToken() refreshToken: string,
  ): Promise<JwtResponse> {
    const jwts = await this.authService.refreshTokens(payload, refreshToken);
    return jwts;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async logoutFromAllDevices(@GetPayload() payload: Payload): Promise<boolean> {
    await this.authService.logoutFromAllDevices(payload);
    return true;
  }
}
