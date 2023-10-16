import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { AllExceptionFilter, WinstonLoggerModule, getEnvironmentFile } from '@app/common';

import { handleAuthContext } from './context/';

const envFilePath = `./apps/gateway/${getEnvironmentFile(process.env.NODE_ENV)}`;
const DefinitionConfigModule = ConfigModule.forRoot({
  envFilePath: envFilePath,
  isGlobal: true,
});

const DefinitionGraphQLModule = GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
  imports: [ConfigModule],
  driver: ApolloGatewayDriver,
  useFactory: (config: ConfigService) => ({
    server: {
      context: handleAuthContext,
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
        ],
      }),
      buildService({ url }) {
        return new RemoteGraphQLDataSource({
          url,
          willSendRequest({ request, context }) {
            request.http.headers.set('authorization', context.authorization);
          },
        });
      },
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
