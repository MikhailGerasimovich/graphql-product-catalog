import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const config = app.get(ConfigService);
  await app.listen(config.get<number>('PORT'));
}
bootstrap();
