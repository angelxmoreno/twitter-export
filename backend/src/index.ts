import 'reflect-metadata';
import server from './server';
import Env from './helpers/Env';

const PORT = Env.string('SERVER_PORT');

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
