import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getEnvironmentFile } from '@app/common';

import { CoreModule } from './core/core.module';
import { User } from './core/baskets/entities';

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
    orphanedTypes: [User],
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

@Module({
  imports: [DefinitionConfigModule, DefinitionGraphQLModule, DefinitionTypeOrmModule, CoreModule],
})
export class BasketsModule {}
