import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';

const DefinitionJwtModule = NestJwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    secret: config.get('ACCESS_SECRET'),
    signOptions: {
      expiresIn: config.get('ACCESS_DURATION'),
    },
  }),
  inject: [ConfigService],
});

@Module({
  imports: [ConfigModule, DefinitionJwtModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
