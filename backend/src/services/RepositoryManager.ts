import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import { TwitterUsersRepository } from '../repositories/TwitterUsersRepository';
import { FollowersRepository } from '../repositories/FollowersRepository';

export default class RepositoryManager {
  static getUsers(): UsersRepository {
    return getCustomRepository(UsersRepository);
  }

  static getTwitterUsers(): TwitterUsersRepository {
    return getCustomRepository(TwitterUsersRepository);
  }

  static getFollowers(): FollowersRepository {
    return getCustomRepository(FollowersRepository);
  }
}
