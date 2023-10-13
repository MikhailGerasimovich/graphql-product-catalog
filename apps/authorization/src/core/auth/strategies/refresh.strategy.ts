import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Payload } from '@app/common';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.headers.authorization;
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: config.get('REFRESH_SECRET'),
    });
  }

  async validate(payload: Payload): Promise<Payload> {
    return payload;
  }
}
