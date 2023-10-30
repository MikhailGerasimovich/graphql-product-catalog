import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as cookieParser from 'cookie-parser';

import { instance } from '@app/common';

import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });
  const config = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(config.get<number>('PORT'));
}
bootstrap();
