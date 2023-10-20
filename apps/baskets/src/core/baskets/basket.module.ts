import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Basket } from './entities';
import { BasketService } from './basket.service';
import { BasketResolver } from './basket.resolver';
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Basket])],
  providers: [BasketService, BasketResolver, UserResolver],
})
export class BasketModule {}
