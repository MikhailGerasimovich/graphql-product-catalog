import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConnectionName } from '../../common';
import { CommandProduct, QueryProduct } from './domain';
import { ProductResolver } from './presentation';
import { CommandProductRepository, QueryProductRepository } from './infrastructure';
import {
  CreateProductHandler,
  DeleteProductHandler,
  FindAllProductsHandler,
  FindOneProductHandler,
  ProductService,
  QueryProductSaga,
  UpdateProductHandler,
} from './application';

const CommandHandlers = [CreateProductHandler, UpdateProductHandler, DeleteProductHandler];
const QueryHandlers = [FindAllProductsHandler, FindOneProductHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([CommandProduct], ConnectionName.Command),
    TypeOrmModule.forFeature([QueryProduct], ConnectionName.Query),
  ],
  providers: [
    CommandProductRepository,
    QueryProductRepository,
    ...CommandHandlers,
    ...QueryHandlers,
    QueryProductSaga,
    ProductService,
    ProductResolver,
  ],
})
export class ProductModule {}
