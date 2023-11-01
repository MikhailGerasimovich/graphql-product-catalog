import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConnectionName } from '../../common';
import { CommandProduct, QueryProduct } from './domain';
import { ProductController, ProductResolver } from './presentation';
import { CommandProductRepository, QueryProductRepository } from './infrastructure';
import {
  CreateProductHandler,
  DeleteProductHandler,
  FindAllProductsHandler,
  FindOneProductHandler,
  ProductService,
  QueryProductSaga,
  TakeProductHandler,
  UpdateProductHandler,
} from './application';
import { JwtStrategy, RedisModule } from '@app/common';

const CommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  DeleteProductHandler,
  TakeProductHandler,
];

const QueryHandlers = [FindAllProductsHandler, FindOneProductHandler];

@Module({
  imports: [
    CqrsModule,
    RedisModule,
    TypeOrmModule.forFeature([CommandProduct], ConnectionName.Command),
    TypeOrmModule.forFeature([QueryProduct], ConnectionName.Query),
  ],
  providers: [
    JwtStrategy,
    CommandProductRepository,
    QueryProductRepository,
    ...CommandHandlers,
    ...QueryHandlers,
    QueryProductSaga,
    ProductService,
    ProductResolver,
  ],
  controllers: [ProductController],
})
export class ProductModule {}
