import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Role, likeFilter, parseTokenExpiration } from '@app/common';

import { Token, User } from './entities';
import { CreateUserInput, FindUserInput, UpdateUserInput } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Token) private readonly tokenRepo: Repository<Token>,
    private readonly config: ConfigService,
  ) {}

  async findAll(findUserInput: FindUserInput): Promise<User[]> {
    const findEntity = this.userRepo.create(findUserInput);
    const users = await this.userRepo.find({
      where: {
        ...likeFilter(findEntity),
      },
    });

    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['tokens'],
    });
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    return user;
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    const userEntity = this.userRepo.create({
      ...createUserInput,
      role: Role.USER,
    });
    const savedUser = await this.userRepo.save(userEntity);
    return savedUser;
  }

  async updateUser(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    const existingUser = await this.findOne(id);
    const userEntity = this.userRepo.create(updateUserInput);

    const updatedUser = await this.userRepo.save({
      ...existingUser,
      ...userEntity,
    });
    return updatedUser;
  }

  async findUserToken(userId: number, refreshToken: string): Promise<Token> {
    const token = await this.tokenRepo.findOne({
      where: {
        user: { id: userId },
        refreshToken,
      },
    });
    return token;
  }

  async saveUserToken(userId: number, refreshToken: string): Promise<Token> {
    const user = await this.findOne(userId);

    const refreshDuration = this.config.get<string>('REFRESH_DURATION');
    const tokenExpiration = parseTokenExpiration(refreshDuration);

    const expirationDate = new Date(new Date().getTime() + tokenExpiration);

    const tokenEntity = this.tokenRepo.create({ refreshToken, expirationDate, user });

    await this.tokenRepo.save(tokenEntity);

    user.tokens.push(tokenEntity);
    await this.userRepo.save(user);
    return tokenEntity;
  }

  async deleteUserToken(userId: number, refreshToken: string): Promise<boolean> {
    const data = await this.tokenRepo.delete({
      user: { id: userId },
      refreshToken,
    });
    return data && data.affected > 0;
  }

  async deleteAllUserTokens(userId: number): Promise<number> {
    const data = await this.tokenRepo.delete({
      user: { id: userId },
    });
    return data.affected;
  }

  async cleanupExpiredTokens(): Promise<number> {
    const data = await this.tokenRepo.delete({
      expirationDate: LessThan(new Date()),
    });

    return data.affected;
  }
}
