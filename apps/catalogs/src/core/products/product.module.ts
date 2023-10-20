import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommandProduct, QueryProduct } from './domain';
import { ProductResolver } from './presentation';
import {
  CreateProductHandler,
  DeleteProductHandler,
  ProductService,
  UpdateProductHandler,
} from './application';
import { CommandProductRepository, QueryProductRepository } from './infrastructure';

const CommandHandlers = [CreateProductHandler, UpdateProductHandler, DeleteProductHandler];

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
    ProductService,
    ProductResolver,
  ],
})
export class ProductModule {}
