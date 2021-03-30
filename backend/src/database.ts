import 'reflect-metadata';
import { getConnectionManager } from 'typeorm';
import Env from './helpers/Env';
import CakePhpNamingStrategy from './helpers/CakePhpNamingStrategy';

const connectionManager = getConnectionManager();
const dbConnection = connectionManager.create({
  type: 'mysql',
  namingStrategy: new CakePhpNamingStrategy(),
  url: Env.string('DATABASE_URL'),
  entities: [`${__dirname}/entities/*.{js,ts}`],
  synchronize: Env.bool('DATABASE_SYNCING'),
  logging: Env.bool('DATABASE_LOGGING'),
});

export default dbConnection;
