import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetPayload = createParamDecorator((data: any, context: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(context);
  const req = gqlContext.getContext().req;

  if (!req.user) {
    return null;
  }

  if (data) {
    return req.user[data];
  }

  return req.user;
});
