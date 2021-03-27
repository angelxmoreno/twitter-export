import express, {Application} from 'express';
import {useExpressServer} from 'routing-controllers';
import compression from 'compression';
import morgan from 'morgan';
import {isDevelopment} from "./helpers/node-env";

const server: Application = express();

useExpressServer(server, {
    cors: true,
    controllers: [`${__dirname}/controllers/*`],
});

server.use(compression());
server.use(morgan(isDevelopment() ? 'tiny' : 'combined'));
export default server;
