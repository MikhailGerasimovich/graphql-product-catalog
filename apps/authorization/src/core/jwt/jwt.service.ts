import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { Payload } from '@app/common';

@Injectable()
export class JwtService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly config: ConfigService,
  ) {}

  async generateAccessJwt(payload: Payload): Promise<string> {
    const accessToken = await this.nestJwtService.signAsync(payload, {
      secret: this.config.get('ACCESS_SECRET'),
      expiresIn: this.config.get('ACCESS_DURATION'),
    });
    return accessToken;
  }

  async generateRefreshJwt(payload: Payload): Promise<string> {
    const refreshToken = await this.nestJwtService.signAsync(payload, {
      secret: this.config.get('REFRESH_SECRET'),
      expiresIn: this.config.get('REFRESH_DURATION'),
    });
    return refreshToken;
  }
}
