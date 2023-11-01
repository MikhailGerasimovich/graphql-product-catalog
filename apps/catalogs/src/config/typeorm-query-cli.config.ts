import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { getEnvironmentFile } from '@app/common';

import { InitQuerySchema1698749209016 } from '../migrations';

const envFilePath = `./apps/catalogs/${getEnvironmentFile(process.env.NODE_ENV)}`;
dotenv.config({ path: envFilePath });

const config = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: config.get('QDB_HOST'),
  port: config.get<number>('QDB_PORT'),
  username: config.get('QDB_USERNAME'),
  password: config.get('QDB_PASSWORD'),
  database: config.get('QDB_NAME'),
  logging: config.get<boolean>('QDB_LOGGING'),
  migrations: [InitQuerySchema1698749209016],
});
