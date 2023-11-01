import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AllExceptionFilter, LoggerMiddleware, WinstonLoggerModule, getEnvironmentFile } from '@app/common';

import { RmqClientName } from './common';
import { CoreModule } from './core/core.module';

const envFilePath = `./apps/orders/${getEnvironmentFile(process.env.NODE_ENV)}`;
const DefinitionConfigModule = ConfigModule.forRoot({
  envFilePath: envFilePath,
  isGlobal: true,
});

const DefinitionGraphQLModule = GraphQLModule.forRoot<ApolloFederationDriverConfig>({
  driver: ApolloFederationDriver,
  typePaths: ['**/*.graphql'],
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
    synchronize: config.get<boolean>('DB_SYNCHRONIZE'),
    autoLoadEntities: config.get<boolean>('DB_AUTO_LOAD_ENTITIES'),
    logging: config.get<boolean>('DB_LOGGING'),
  }),
});

const DefinitionRmqClientModule = ClientsModule.registerAsync({
  isGlobal: true,
  clients: [
    {
      name: RmqClientName.Basket,
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [config.get<string>('RMQ_URL')],
          queue: config.get<string>('RMQ_QUEUE_BASKETS'),
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
export class OrdersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
