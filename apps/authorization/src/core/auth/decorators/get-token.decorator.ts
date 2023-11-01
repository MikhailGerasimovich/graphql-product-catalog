import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Cookie } from '@app/common';

export const GetToken = createParamDecorator((data: any, context: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(context);
  const req = gqlContext.getContext().req;
  const jwts = req?.cookies[Cookie.Auth];
  if (!jwts) {
    return null;
  }
  return jwts.refreshToken;
});
