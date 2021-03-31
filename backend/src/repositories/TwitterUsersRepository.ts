import { DeepPartial, EntityRepository, FindConditions } from 'typeorm';
import RepositoryBase from './RepositoryBase';
import { TwitterUserEntity } from '../entities/TwitterUserEntity';
import { TwitterUser } from '../TwitterEntities';

@EntityRepository(TwitterUserEntity)
export class TwitterUsersRepository extends RepositoryBase<TwitterUserEntity> {
  async saveRaw(user: TwitterUser): Promise<TwitterUserEntity> {
    const conditions: FindConditions<TwitterUserEntity> = { id: user.id_str };
    const partial: DeepPartial<TwitterUserEntity> = {
      id: user.id_str,
      data: user,
    };
    const [twitterUser] = await this.upsert(conditions, partial);
    return twitterUser;
  }

  saveManyRaw(users: TwitterUser[]): Promise<TwitterUserEntity[]> {
    const partials: DeepPartial<TwitterUserEntity>[] = users.map(user => ({ id: user.id_str, data: user }));
    return this.repository.save(partials);
  }
}
