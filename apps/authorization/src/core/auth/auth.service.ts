import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

import { UserService } from '../users/user.service';
import { User } from '../users/entities';
import { JwtService } from '../jwt/jwt.service';
import { JwtResponse } from './response';
import { SignUpInput } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSerivce: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateSignIn(email: string, pass: string): Promise<User> {
    const existingUser = await this.userSerivce.findOneByEmail(email);
    if (existingUser && (await compare(pass, existingUser.password))) {
      return existingUser;
    }

    throw new UnauthorizedException('Incorrect login and/or password entered');
  }

  async signUp(signUpInput: SignUpInput): Promise<JwtResponse> {
    const existiongUser = await this.userSerivce.findOneByEmail(signUpInput.email);
    if (existiongUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordSalt = await genSalt();
    const hashPassword = await hash(signUpInput.password, passwordSalt);
    const createUserinput = { ...signUpInput, password: hashPassword, passwordSalt };
    const user = await this.userSerivce.create(createUserinput);

    const payload = { sub: user.id, role: user.role };
    const accessToken = await this.jwtService.generateAccessJwt(payload);
    const refreshToken = await this.jwtService.generateRefreshJwt(payload);
    return { accessToken, refreshToken };
  }

  async signIn(user: User): Promise<JwtResponse> {
    const payload = { sub: user.id, role: user.role };
    const accessToken = await this.jwtService.generateAccessJwt(payload);
    const refreshToken = await this.jwtService.generateRefreshJwt(payload);
    return { accessToken, refreshToken };
  }

  async logout() {}

  async refreshTokens() {}
}
