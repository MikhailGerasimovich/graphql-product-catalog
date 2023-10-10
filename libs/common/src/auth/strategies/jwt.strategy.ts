import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Payload } from '../types/payload.type';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.headers.authorization;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('ACCESS_SECRET'),
    });
  }

  async validate(payload: Payload): Promise<Payload> {
    return payload;
  }
}
