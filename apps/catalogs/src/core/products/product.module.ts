import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { CommandProduct, QueryProduct } from './domain';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommandProduct], 'command_db'),
    TypeOrmModule.forFeature([QueryProduct], 'query_db'),
  ],
  providers: [],
})
export class ProductModule {}
