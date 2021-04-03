import { Application } from 'express';
import { createExpressServer } from 'routing-controllers';
import compression from 'compression';
import morgan from 'morgan';
import { isDevelopment } from './helpers/node-env';
import { JsonErrorHandler } from './middlewares/JsonErrorHandler';
import { NotFoundMiddleware } from './middlewares/NotFoundMiddleware';
import currentUserChecker from './helpers/currentUserChecker';
import Env from './helpers/Env';

const server: Application = createExpressServer({
  routePrefix: Env.string('API_PREFIX', ''),
  cors: true,
  defaultErrorHandler: false,
  currentUserChecker,
  controllers: [`${__dirname}/controllers/*`],
  middlewares: [NotFoundMiddleware, JsonErrorHandler],
  development: isDevelopment(),
});

server.use(compression());
server.use(morgan(isDevelopment() ? 'tiny' : 'combined'));

export default server;
