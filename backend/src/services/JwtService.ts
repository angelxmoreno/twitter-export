import jwt from 'jsonwebtoken';
import Env from '../helpers/Env';
import { UserEntity } from '../entities/UserEntity';
import RepositoryManager from './RepositoryManager';

interface DecodedToken {
  uid: string;
  iat: number;
  exp: number;
}

const JWT_KEY = Env.string('JWT_KEY');
const EXPIRY_SECONDS = Env.int('JWT_EXPIRY_MINUTES') * 60;
const JwtService = {
  fromUser: (user: UserEntity): string => {
    return jwt.sign({ uid: user.id }, JWT_KEY, {
      algorithm: 'HS256',
      expiresIn: EXPIRY_SECONDS,
    });
  },
  toUser: async (token: string): Promise<UserEntity | undefined> => {
    try {
      const payload = jwt.verify(token, JWT_KEY) as DecodedToken;
      return RepositoryManager.getUsers().get(payload.uid);
    } catch (e) {
      return undefined;
    }
  },
};

export default JwtService;
