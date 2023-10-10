import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role, likeFilter } from '@app/common';

import { User } from './entities';
import { CreateUserInput, FindUserInput, UpdateUserInput } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

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
    const user = await this.userRepo.findOne({ where: { id } });
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
}
