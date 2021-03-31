import { DeepPartial, EntityRepository } from 'typeorm';
import RepositoryBase from './RepositoryBase';
import { FollowerEntity } from '../entities/FollowerEntity';
import { UserEntity } from '../entities/UserEntity';

@EntityRepository(FollowerEntity)
export class FollowersRepository extends RepositoryBase<FollowerEntity> {
  linkIds(user: UserEntity, ids: string[]): Promise<FollowerEntity[]> {
    const partials: DeepPartial<FollowerEntity>[] = ids.map(id => ({
      twitterUserId: user.twitterUserId,
      followerId: id,
    }));

    return this.repository.save(partials);
  }
}
