import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderProduct } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProduct])],
})
export class OrderProductModule {}
