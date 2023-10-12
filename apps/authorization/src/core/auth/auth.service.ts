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
    await this.userSerivce.saveUserToken(user.id, jwts.refreshToken);

    return jwts;
  }

  async signIn(user: User): Promise<JwtResponse> {
    const jwts = await this.generateJwts(user.id, user.role);
    await this.userSerivce.saveUserToken(user.id, jwts.refreshToken);

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

    await this.userSerivce.deleteAllUserTokens(user.id);

    const jwts = await this.generateJwts(user.id, user.role);
    await this.userSerivce.saveUserToken(user.id, jwts.refreshToken);

    return jwts;
  }

  async logout(payload: Payload, refreshToken: string): Promise<void> {
    await this.userSerivce.deleteUserToken(payload.sub, refreshToken);
  }

  async refreshTokens(payload: Payload, refreshToken: string): Promise<JwtResponse> {
    const token = await this.userSerivce.findUserToken(payload.sub, refreshToken);

    if (!token) {
      await this.userSerivce.deleteAllUserTokens(payload.sub);
      throw new UnauthorizedException(
        `There is no token, for security reasons you need to log in to the service again on all devices using your email and password`,
      );
    }

    if (token.expirationDate < new Date()) {
      await this.userSerivce.deleteUserToken(payload.sub, refreshToken);
      throw new UnauthorizedException(
        `The token's lifetime has expired, log in to your account using your email and password`,
      );
    }

    await this.userSerivce.deleteUserToken(payload.sub, refreshToken);
    const jwts = await this.generateJwts(payload.sub, payload.role);
    await this.userSerivce.saveUserToken(payload.sub, jwts.refreshToken);

    return jwts;
  }

  async logoutFromAllDevices(payload: Payload): Promise<void> {
    await this.userSerivce.deleteAllUserTokens(payload.sub);
  }

  private async generateJwts(userId: number, userRole: string): Promise<JwtResponse> {
    const payload = { sub: userId, role: userRole };
    const accessToken = await this.jwtService.generateAccessJwt(payload);
    const refreshToken = await this.jwtService.generateRefreshJwt(payload);
    return { accessToken, refreshToken };
  }
}
