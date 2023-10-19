import { Module } from '@nestjs/common';

import { BasketModule } from './baskets/basket.module';

@Module({
  imports: [BasketModule],
})
export class CoreModule {}
