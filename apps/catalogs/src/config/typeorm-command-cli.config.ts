import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { getEnvironmentFile } from '@app/common';

import { InitCommandSchema1698749226055 } from '../migrations';

const envFilePath = `./apps/catalogs/${getEnvironmentFile(process.env.NODE_ENV)}`;
dotenv.config({ path: envFilePath });

const config = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: config.get('CDB_HOST'),
  port: config.get<number>('CDB_PORT'),
  username: config.get('CDB_USERNAME'),
  password: config.get('CDB_PASSWORD'),
  database: config.get('CDB_NAME'),
  logging: config.get<boolean>('CDB_LOGGING'),
  migrations: [InitCommandSchema1698749226055],
});
