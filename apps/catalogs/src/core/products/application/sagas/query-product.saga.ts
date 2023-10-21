import { Injectable } from '@nestjs/common';
import { QueryProductRepository } from '../../infrastructure';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, map, delay } from 'rxjs';
import { CreateProductEvent, DeleteProductEvent, UpdateProductEvent } from '../events';

@Injectable()
export class QueryProductSaga {
  constructor(private readonly repository: QueryProductRepository) {}

  @Saga()
  productCreated(events$: Observable<any>): Observable<void> {
    return events$.pipe(
      ofType(CreateProductEvent),
      map((event) => {
        const { product } = event;
        this.repository.save(product);
      }),
    );
  }

  @Saga()
  productUpdated(events$: Observable<any>): Observable<void> {
    return events$.pipe(
      ofType(UpdateProductEvent),
      map((event) => {
        const { product } = event;
        this.repository.save(product);
      }),
    );
  }

  @Saga()
  productDeleted(events$: Observable<any>): Observable<void> {
    return events$.pipe(
      ofType(DeleteProductEvent),
      map((event) => {
        const { productId } = event;
        this.repository.delete(productId);
      }),
    );
  }
}
