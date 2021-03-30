import { Action } from 'routing-controllers';
import { isDevelopment } from './node-env';
import JwtService from '../services/JwtService';
import RepositoryManager from '../services/RepositoryManager';
import Env from '../helpers/Env';
import { User } from '../entities/User';

const currentUserChecker = (action: Action): Promise<User | undefined> => {
  const authorization = action.request.header('Authorization');
  const jwt = authorization?.split(' ')[1];
  return jwt === 'test-user' && isDevelopment()
    ? RepositoryManager.getUsers().get(Env.string('TEST_USER_ID'))
    : JwtService.toUser(jwt);
};

export default currentUserChecker;
