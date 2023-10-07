import { IntrospectAndCompose } from '@apollo/gateway';
import { Module } from '@nestjs/common';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

const envFilePath = './apps/gateway/.env';

const DefinitionConfigModule = ConfigModule.forRoot({
  envFilePath: envFilePath,
});

const DefinitionGraphQLModule = GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
  imports: [ConfigModule],
  driver: ApolloGatewayDriver,
  useFactory: (config: ConfigService) => ({
    server: {},
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
    },
  }),
  inject: [ConfigService],
});

@Module({
  imports: [DefinitionConfigModule, DefinitionGraphQLModule],
})
export class GatewayModule {}
