import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '@app/common';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../users/user.module';
import { JwtModule } from '../jwt/jwt.module';
import { LocalStrategy, RefreshStrategy } from './strategies';

@Module({
  imports: [PassportModule, UserModule, JwtModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy, AuthResolver],
})
export class AuthModule {}
