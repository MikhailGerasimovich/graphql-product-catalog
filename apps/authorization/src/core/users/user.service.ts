import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { likeFilter } from '@app/common';

import { User } from './entities';
import { FindUserInput } from './dto';

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
    const product = await this.userRepo.findOne({ where: { id } });
    return product;
  }
}
