import { Module } from '@nestjs/common';

import { BasketsModule } from './baskets/baskets.module';

@Module({
  imports: [BasketsModule],
})
export class CoreModule {}
