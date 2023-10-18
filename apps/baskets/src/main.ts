import { NestFactory } from '@nestjs/core';
import { BasketsModule } from './baskets.module';

async function bootstrap() {
  const app = await NestFactory.create(BasketsModule);
  await app.listen(3000);
}
bootstrap();
