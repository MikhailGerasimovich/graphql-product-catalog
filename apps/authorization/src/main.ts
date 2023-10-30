import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

import { instance } from '@app/common';

import { AuthorizationModule } from './authorization.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthorizationModule, {
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

  app.use(
    session({
      secret: config.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

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
      queue: config.get<string>('RMQ_QUEUE_AUTH'),
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
