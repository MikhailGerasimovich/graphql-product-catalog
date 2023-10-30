import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AllExceptionFilter, LoggerMiddleware, WinstonLoggerModule, getEnvironmentFile } from '@app/common';

import { CoreModule } from './core/core.module.';

const envFilePath = `./apps/authorization/${getEnvironmentFile(process.env.NODE_ENV)}`;
const DefinitionConfigModule = ConfigModule.forRoot({
  envFilePath: envFilePath,
  isGlobal: true,
});

const DefinitionGraphQLModule = GraphQLModule.forRoot<ApolloFederationDriverConfig>({
  driver: ApolloFederationDriver,
  context: ({ req, res }) => ({ req, res }),
  autoSchemaFile: {
    federation: 2,
  },
});

const DefinitionTypeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
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
  inject: [ConfigService],
});

const DefinitionScheduleModule = ScheduleModule.forRoot();

@Module({
  imports: [
    DefinitionConfigModule,
    DefinitionGraphQLModule,
    DefinitionTypeOrmModule,
    DefinitionScheduleModule,
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
export class AuthorizationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
