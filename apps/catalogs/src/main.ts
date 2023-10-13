import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { CatalogsModule } from './catalogs.module';

async function bootstrap() {
  const app = await NestFactory.create(CatalogsModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.get<string>('RMQ_URL')],
      queue: config.get<string>('RMQ_QUEUE_CATALOGS'),
      noAck: true,
      persistent: true,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(config.get<number>('PORT'));
}
bootstrap();
