import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { getEnvironmentFile } from '@app/common';

import { InitSchema1698756308622 } from '../migrations';

const envFilePath = `./apps/orders/${getEnvironmentFile(process.env.NODE_ENV)}`;
dotenv.config({ path: envFilePath });

const config = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: config.get('DB_HOST'),
  port: config.get<number>('DB_PORT'),
  username: config.get('DB_USERNAME'),
  password: config.get('DB_PASSWORD'),
  database: config.get('DB_NAME'),
  logging: config.get<boolean>('DB_LOGGING'),
  migrations: [InitSchema1698756308622],
});
