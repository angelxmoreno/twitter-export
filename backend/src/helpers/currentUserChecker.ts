import { Action } from 'routing-controllers';
import { isDevelopment } from './node-env';
import JwtService from '../services/JwtService';
import RepositoryManager from '../services/RepositoryManager';
import Env from '../helpers/Env';
import { UserEntity } from '../entities/UserEntity';

const currentUserChecker = (action: Action): Promise<UserEntity | undefined> => {
  const authorization = action.request.header('Authorization');
  const jwt = authorization?.split(' ')[1];
  return jwt === 'test-user' && isDevelopment()
    ? RepositoryManager.getUsers().get(Env.string('TEST_USER_ID'))
    : JwtService.toUser(jwt);
};

export default currentUserChecker;
