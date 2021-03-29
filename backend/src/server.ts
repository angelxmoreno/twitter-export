import { Application } from 'express';
import { createExpressServer } from 'routing-controllers';
import compression from 'compression';
import morgan from 'morgan';
import { isDevelopment } from './helpers/node-env';
import { JsonErrorHandler } from './middlewares/JsonErrorHandler';
import { NotFoundMiddleware } from './middlewares/NotFoundMiddleware';

const server: Application = createExpressServer({
  cors: true,
  defaultErrorHandler: false,
  controllers: [`${__dirname}/controllers/*`],
  middlewares: [NotFoundMiddleware, JsonErrorHandler],
  development: isDevelopment(),
});

server.use(compression());
server.use(morgan(isDevelopment() ? 'tiny' : 'combined'));

export default server;
