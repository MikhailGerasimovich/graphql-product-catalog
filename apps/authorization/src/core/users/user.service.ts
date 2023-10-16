import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, LessThan, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Role, likeFilter, parseTokenExpiration } from '@app/common';

import { Token, User } from './entities';
import { CreateUserInput, FindUserInput, UpdateUserInput } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    private readonly config: ConfigService,
  ) {}

  async findAll(findUserInput: FindUserInput): Promise<User[]> {
    const findEntity = this.userRepository.create(findUserInput);
    const users = await this.userRepository.find({
      where: {
        ...likeFilter(findEntity),
      },
    });

    return users;
  }

  async findOne(id: number, manager?: EntityManager): Promise<User> {
    const userRepo = await this.getUserRepo(manager);
    const user = await userRepo.findOne({
      where: { id },
      relations: ['tokens'],
    });
    return user;
  }

  async findOneByEmail(email: string, manager?: EntityManager): Promise<User> {
    const userRepo = await this.getUserRepo(manager);
    const user = await userRepo.findOne({ where: { email } });
    return user;
  }

  async create(createUserInput: CreateUserInput, manager?: EntityManager): Promise<User> {
    const userRepo = await this.getUserRepo(manager);
    const userEntity = userRepo.create({
      ...createUserInput,
      role: Role.USER,
    });
    const savedUser = await userRepo.save(userEntity);
    return savedUser;
  }

  async updateUser(id: number, updateUserInput: UpdateUserInput, manager?: EntityManager): Promise<User> {
    const userRepo = await this.getUserRepo(manager);

    const existingUser = await this.findOne(id);
    const userEntity = userRepo.create(updateUserInput);

    const updatedUser = await userRepo.save({
      ...existingUser,
      ...userEntity,
    });
    return updatedUser;
  }

  async findUserToken(userId: number, refreshToken: string, manager?: EntityManager): Promise<Token> {
    const tokenRepo = await this.getTokenRepo(manager);
    const token = await tokenRepo.findOne({
      where: {
        user: { id: userId },
        refreshToken,
      },
    });
    return token;
  }

  async saveUserToken(userId: number, refreshToken: string, manager?: EntityManager): Promise<Token> {
    const tokenRepo = await this.getTokenRepo(manager);
    const userRepo = await this.getUserRepo(manager);

    const user = await this.findOne(userId, manager);

    const refreshDuration = this.config.get<string>('REFRESH_DURATION');
    const tokenExpiration = parseTokenExpiration(refreshDuration);

    const expirationDate = new Date(new Date().getTime() + tokenExpiration);

    const tokenEntity = tokenRepo.create({ refreshToken, expirationDate, user });

    await tokenRepo.save(tokenEntity);

    user.tokens.push(tokenEntity);
    await userRepo.save(user);
    return tokenEntity;
  }

  async deleteUserToken(userId: number, refreshToken: string, manager?: EntityManager): Promise<boolean> {
    const tokenRepo = await this.getTokenRepo(manager);

    const data = await tokenRepo.delete({
      user: { id: userId },
      refreshToken,
    });
    return data && data.affected > 0;
  }

  async deleteAllUserTokens(userId: number, manager?: EntityManager): Promise<number> {
    const tokenRepo = await this.getTokenRepo(manager);

    const data = await tokenRepo.delete({
      user: { id: userId },
    });
    return data.affected;
  }

  @Cron(CronExpression.EVERY_WEEK)
  async cleanupExpiredTokens(): Promise<number> {
    const data = await this.tokenRepository.delete({
      expirationDate: LessThan(new Date()),
    });

    return data.affected;
  }

  private async getUserRepo(entityManager: EntityManager): Promise<Repository<User>> {
    if (entityManager) {
      return entityManager.getRepository(User);
    }
    return this.userRepository;
  }

  private async getTokenRepo(entityManager: EntityManager): Promise<Repository<Token>> {
    if (entityManager) {
      return entityManager.getRepository(Token);
    }
    return this.tokenRepository;
  }
}
