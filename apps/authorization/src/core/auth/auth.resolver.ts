import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { GetPayload } from '@app/common';

import { User } from '../users/entities';
import { AuthService } from './auth.service';
import { SignInInput, SignUpInput } from './dto';
import { JwtResponse } from './response';
import { LocalAuthGuard } from './guards';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => JwtResponse)
  async signUp(@Args('input') signUpInput: SignUpInput): Promise<JwtResponse> {
    const jwts = await this.authService.signUp(signUpInput);
    return jwts;
  }

  @UseGuards(LocalAuthGuard)
  @Mutation(() => JwtResponse)
  async signIn(@Args('input') signInInput: SignInInput, @GetPayload() user: User) {
    const jwts = await this.authService.signIn(user);
    return jwts;
  }
}
