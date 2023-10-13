import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { TRANSACTION_FIELD } from '../interceptors';

export const GetTransaction = createParamDecorator((data: any, context: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(context);
  const req = gqlContext.getContext().req;

  return req[TRANSACTION_FIELD];
});
