import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommandProduct, QueryProduct } from './domain';
import { ProductResolver } from './presentation';
import { CommandProductRepository, QueryProductRepository } from './infrastructure';
import {
  CreateProductHandler,
  DeleteProductHandler,
  FindAllProductsHandler,
  FindOneProductHandler,
  ProductService,
  UpdateProductHandler,
} from './application';

const CommandHandlers = [CreateProductHandler, UpdateProductHandler, DeleteProductHandler];
const QueryHandlers = [FindAllProductsHandler, FindOneProductHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([CommandProduct], 'command_db'),
    TypeOrmModule.forFeature([QueryProduct], 'query_db'),
  ],
  providers: [
    CommandProductRepository,
    QueryProductRepository,
    ...CommandHandlers,
    ...QueryHandlers,
    ProductService,
    ProductResolver,
  ],
})
export class ProductModule {}
