import { UnauthorizedException } from '@nestjs/common';

export function handleAuthContext({ req }) {
  try {
    if (req.headers.authorization) {
      const authorization = req.headers.authorization;
      const [bearer, token] = authorization.split(' ');
      if (bearer != 'Bearer' || !token) {
        throw new UnauthorizedException('Bearer token is required');
      }
      return {
        authorization: token,
      };
    }
  } catch (err) {
    throw new UnauthorizedException('Error receiving authorization token');
  }
}
