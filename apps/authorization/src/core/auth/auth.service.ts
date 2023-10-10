import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

import { Payload } from '@app/common';

import { UserService } from '../users/user.service';
import { User } from '../users/entities';
import { JwtService } from '../jwt/jwt.service';
import { JwtResponse } from './response';
import { ChangePasswordInput, SignUpInput } from './dto';

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

    const jwts = await this.generateJwts(user.id, user.role);
    return jwts;
  }

  async signIn(user: User): Promise<JwtResponse> {
    const jwts = await this.generateJwts(user.id, user.role);
    return jwts;
  }

  async changePassword(payload: Payload, input: ChangePasswordInput): Promise<JwtResponse> {
    const existiongUser = await this.userSerivce.findOne(payload.sub);
    if (!existiongUser) {
      throw new BadRequestException('User does not exist');
    }

    const { oldPassword, newPassword } = input;
    const isMatch = await compare(oldPassword, existiongUser.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect password entered');
    }

    if (oldPassword == newPassword) {
      throw new BadRequestException('The old and new passwords must not be the same');
    }

    const passwordSalt = await genSalt();
    const hashPassword = await hash(newPassword, passwordSalt);
    const updateUserInput = { password: hashPassword, passwordSalt };
    const user = await this.userSerivce.updateUser(existiongUser.id, updateUserInput);

    const jwts = await this.generateJwts(user.id, user.role);
    return jwts;
  }

  async logout() {}

  async refreshTokens() {}

  private async generateJwts(userId: number, userRole: string): Promise<JwtResponse> {
    const payload = { sub: userId, role: userRole };
    const accessToken = await this.jwtService.generateAccessJwt(payload);
    const refreshToken = await this.jwtService.generateRefreshJwt(payload);
    return { accessToken, refreshToken };
  }
}
