import { UserEntity } from '../entities/UserEntity';
import JwtService from '../services/JwtService';

export type UserWithJWTResponse = {
  jwt: string;
  user: {
    id: string;
    twitterUserId: string;
    screenName: string;
  };
};
const JwtResponseFromUser = (user: UserEntity): UserWithJWTResponse => {
  const jwt = JwtService.fromUser(user);
  return {
    jwt,
    user: {
      id: user.id,
      twitterUserId: user.twitterUserId,
      screenName: user.screenName,
    },
  };
};

export default JwtResponseFromUser;
