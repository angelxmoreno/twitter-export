import 'reflect-metadata';
import server from './server';
import Env from './helpers/Env';
import dbConnection from './database';

const PORT = Env.string('SERVER_PORT');

const start = async () => {
  const connection = await dbConnection.connect();
  console.log(`⚡️[database]: Connection established: ${connection.name}`);
  server.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  });
};

start().catch(console.error);
