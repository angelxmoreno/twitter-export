import 'reflect-metadata';
import { getConnectionManager } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import Env from './helpers/Env';

const connectionManager = getConnectionManager();
const dbConnection = connectionManager.create({
  type: 'mysql',
  namingStrategy: new SnakeNamingStrategy(),
  url: Env.string('DATABASE_URL'),
  entities: [`${__dirname}/entity/*.{js,ts}`],
  synchronize: Env.bool('DATABASE_SYNCING'),
  logging: Env.bool('DATABASE_LOGGING'),
});

export default dbConnection;
