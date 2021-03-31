import { EntityRepository } from 'typeorm';
import { AccessTokenResponse } from 'twitter-lite';
import { DeepPartial } from 'typeorm/browser';
import RepositoryBase from './RepositoryBase';
import { UserEntity } from '../entities/UserEntity';

@EntityRepository(UserEntity)
export class UsersRepository extends RepositoryBase<UserEntity> {
  findByTwitterId(id: string): Promise<UserEntity | undefined> {
    return this.findOne({ twitterUserId: id });
  }

  async createFromAccessTokenResponse(accessTokenResponse: AccessTokenResponse): Promise<UserEntity> {
    const partial: DeepPartial<UserEntity> = {
      oauthToken: accessTokenResponse.oauth_token,
      oauthTokenSecret: accessTokenResponse.oauth_token_secret,
      screenName: accessTokenResponse.screen_name,
      twitterUserId: accessTokenResponse.user_id,
    };
    let user = await this.findByTwitterId(accessTokenResponse.user_id);
    if (!user) {
      user = await this.create(partial);
    } else {
      user = this.repository.merge(user, partial);
    }
    await this.save(user);
    return user;
  }
}
