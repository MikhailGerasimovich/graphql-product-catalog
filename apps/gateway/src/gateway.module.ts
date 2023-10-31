import { IntrospectAndCompose } from '@apollo/gateway';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { AllExceptionFilter, WinstonLoggerModule, getEnvironmentFile } from '@app/common';

import { GraphQLDataSource } from './configs';

const envFilePath = `./apps/gateway/${getEnvironmentFile(process.env.NODE_ENV)}`;
const DefinitionConfigModule = ConfigModule.forRoot({
  envFilePath: envFilePath,
  isGlobal: true,
});

const DefinitionGraphQLModule = GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
  imports: [ConfigModule],
  driver: ApolloGatewayDriver,
  useFactory: (config: ConfigService) => ({
    server: {},
    cors: {
      origin: true,
      credentials: true,
    },
    gateway: {
      supergraphSdl: new IntrospectAndCompose({
        subgraphHealthCheck: true,
        subgraphs: [
          {
            name: config.get<string>('AUTH_NAME'),
            url: config.get<string>('AUTH_URL'),
          },
          {
            name: config.get<string>('CATALOGS_NAME'),
            url: config.get<string>('CATALOGS_URL'),
          },
          {
            name: config.get<string>('BASKETS_NAME'),
            url: config.get<string>('BASKETS_URL'),
          },
          {
            name: config.get<string>('ORDERS_NAME'),
            url: config.get<string>('ORDERS_URL'),
          },
        ],
      }),
      buildService: (args) => new GraphQLDataSource(args),
    },
  }),
  inject: [ConfigService],
});

@Module({
  imports: [DefinitionConfigModule, DefinitionGraphQLModule, WinstonLoggerModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class GatewayModule {}
