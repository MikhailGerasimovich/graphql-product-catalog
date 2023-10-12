import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtsGuard extends AuthGuard('refresh') {
  getRequest(context: ExecutionContext) {
    const request = context.getArgByIndex(2).req;
    return request;
  }
}
