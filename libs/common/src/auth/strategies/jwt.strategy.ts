import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Payload } from '../types/';
import { Cookie } from '../../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const jwts = request?.cookies[Cookie.Auth];
          if (!jwts) {
            return null;
          }
          return jwts.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('ACCESS_SECRET'),
    });
  }

  async validate(payload: Payload): Promise<Payload> {
    if (!payload) {
      throw new UnauthorizedException('Missing access jwt');
    }
    return payload;
  }
}
