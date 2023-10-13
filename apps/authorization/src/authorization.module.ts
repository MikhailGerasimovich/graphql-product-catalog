import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AllExceptionFilter } from '@app/common';

import { CoreModule } from './core/core.module.';
import { ScheduleModule } from '@nestjs/schedule';

const envFilePath = './apps/authorization/.env';
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
    synchronize: true,
    autoLoadEntities: true,
    logging: true,
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
    CoreModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AuthorizationModule {}
