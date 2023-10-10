import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../users/user.module';
import { JwtModule } from '../jwt/jwt.module';
import { LocalStrategy } from './strategies';

@Module({
  imports: [PassportModule, UserModule, JwtModule],
  providers: [AuthService, LocalStrategy, AuthResolver],
})
export class AuthModule {}
