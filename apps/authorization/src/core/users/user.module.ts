import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { Token, User } from './entities';

import { JwtStrategy, SessionSerializer } from '@app/common';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  providers: [UserResolver, UserService, JwtStrategy, SessionSerializer],
  exports: [UserService],
})
export class UserModule {}
