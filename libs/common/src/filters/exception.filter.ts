import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';

export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      throw new ApolloError(exception.message, `${status}`);
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApolloError(exception.message, `${status}`);
  }
}
