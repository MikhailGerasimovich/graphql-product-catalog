import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, catchError, concatMap, finalize } from 'rxjs';
import { DataSource } from 'typeorm';

import { TRANSACTION_FIELD } from '../constants';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    req[TRANSACTION_FIELD] = queryRunner.manager;

    return next.handle().pipe(
      concatMap(async (data) => {
        await queryRunner.commitTransaction();
        return data;
      }),

      catchError(async (e) => {
        await queryRunner.rollbackTransaction();
        throw e;
      }),

      finalize(async () => {
        await queryRunner.release();
      }),
    );
  }
}
