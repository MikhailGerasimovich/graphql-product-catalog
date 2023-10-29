import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AllExceptionFilter, LoggerMiddleware, WinstonLoggerModule, getEnvironmentFile } from '@app/common';

import { CoreModule } from './core/core.module';
import { User } from './core/baskets/entities';
import { Product } from './core/basket-products/entities';
import { RmqClientName } from './common';

const envFilePath = `./apps/baskets/${getEnvironmentFile(process.env.NODE_ENV)}`;
const DefinitionConfigModule = ConfigModule.forRoot({
  envFilePath: envFilePath,
  isGlobal: true,
});

const DefinitionGraphQLModule = GraphQLModule.forRoot<ApolloFederationDriverConfig>({
  driver: ApolloFederationDriver,
  autoSchemaFile: {
    federation: 2,
  },
  buildSchemaOptions: {
    orphanedTypes: [User, Product],
  },
});

const DefinitionTypeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('DB_HOST'),
    port: config.get<number>('DB_PORT'),
    username: config.get('DB_USERNAME'),
    password: config.get('DB_PASSWORD'),
    database: config.get('DB_NAME'),
    synchronize: true,
    autoLoadEntities: true,
    logging: true,
  }),
});

const DefinitionRmqClientModule = ClientsModule.registerAsync({
  isGlobal: true,
  clients: [
    {
      name: RmqClientName.Catalog,
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [config.get<string>('RMQ_URL')],
          queue: config.get<string>('RMQ_QUEUE_CATALOGS'),
          queueOptions: {
            durable: true,
          },
          noAck: true,
          persistent: true,
        },
      }),
    },
  ],
});

@Module({
  imports: [
    DefinitionConfigModule,
    DefinitionGraphQLModule,
    DefinitionTypeOrmModule,
    DefinitionRmqClientModule,
    WinstonLoggerModule,
    CoreModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class BasketsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
