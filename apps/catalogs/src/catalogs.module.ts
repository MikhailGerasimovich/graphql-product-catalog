import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AllExceptionFilter, LoggerMiddleware, WinstonLoggerModule, getEnvironmentFile } from '@app/common';

import { CoreModule } from './core/core.module';

const envFilePath = `./apps/catalogs/${getEnvironmentFile(process.env.NODE_ENV)}`;
const DefinitionConfigModule = ConfigModule.forRoot({
  envFilePath: envFilePath,
  isGlobal: true,
});

const DefinitionGraphQLModule = GraphQLModule.forRoot<ApolloFederationDriverConfig>({
  driver: ApolloFederationDriver,
  autoSchemaFile: {
    federation: 2,
  },
});

const CommandDBModule = TypeOrmModule.forRootAsync({
  name: 'command_db',
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('CDB_HOST'),
    port: config.get<number>('CDB_PORT'),
    username: config.get('CDB_USERNAME'),
    password: config.get('CDB_PASSWORD'),
    database: config.get('CDB_NAME'),
    synchronize: true,
    autoLoadEntities: true,
    logging: true,
  }),
  inject: [ConfigService],
});

const QueryDBModule = TypeOrmModule.forRootAsync({
  name: 'query_db',
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('QDB_HOST'),
    port: config.get<number>('QDB_PORT'),
    username: config.get('QDB_USERNAME'),
    password: config.get('QDB_PASSWORD'),
    database: config.get('QDB_NAME'),
    synchronize: true,
    autoLoadEntities: true,
    logging: true,
  }),
  inject: [ConfigService],
});

@Module({
  imports: [
    DefinitionConfigModule,
    DefinitionGraphQLModule,
    CommandDBModule,
    QueryDBModule,
    WinstonLoggerModule,
    CoreModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class CatalogsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
