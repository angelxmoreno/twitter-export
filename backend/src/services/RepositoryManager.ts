import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';

export default class RepositoryManager {
  static getUsers(): UsersRepository {
    return getCustomRepository(UsersRepository);
  }
}
