import 'reflect-metadata';
import { getConnectionManager } from 'typeorm';
import Env from './helpers/Env';
import CakePhpNamingStrategy from './helpers/CakePhpNamingStrategy';

const connectionManager = getConnectionManager();
const dbConnection = connectionManager.create({
  type: 'mysql',
  namingStrategy: new CakePhpNamingStrategy(),
  url: Env.string('DATABASE_URL', 'mysql://127.0.0.1/db'),
  entities: [`${__dirname}/entities/*.{js,ts}`],
  synchronize: Env.bool('DATABASE_SYNCING', true),
  logging: Env.bool('DATABASE_LOGGING', true),
});

export default dbConnection;
