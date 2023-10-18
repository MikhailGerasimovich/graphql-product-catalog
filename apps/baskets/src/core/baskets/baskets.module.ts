import { Module } from '@nestjs/common';
import { BasketsService } from './baskets.service';
import { BasketsResolver } from './baskets.resolver';

@Module({
  providers: [BasketsResolver, BasketsService],
})
export class BasketsModule {}
