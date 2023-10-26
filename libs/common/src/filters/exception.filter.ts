import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { Request } from 'express';

import { WinstonLoggerService } from '../logger';

function makeExceptionMessage(req: Request, error: any): string {
  const exceptionmsg = `[EXCEPTION MESSAGE]: ${error.message}`;
  const user = req.user ? `[USER]: ${JSON.stringify(req.user)}` : '';
  const method = `[METHOD]: ${req.method}`;
  const url = `[URL]: ${req.baseUrl}`;
  const headers = `[HEADERS]: ${JSON.stringify(req.headers)}`;
  const query = `[QUERY]: ${JSON.stringify(req.body.query)}`;
  const exception = `[EXCEPTION]: ${JSON.stringify(error)}`;

  return [exceptionmsg, user, method, url, headers, query, exception].join('\t');
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const req = host.getArgByIndex(2).req;

    this.logger.error(makeExceptionMessage(req, exception));

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      throw new ApolloError(exception.message, `${status}`);
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApolloError(exception.message, `${status}`);
  }
}
