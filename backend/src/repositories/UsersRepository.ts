import { EntityRepository } from 'typeorm';
import { AccessTokenResponse } from 'twitter-lite';
import { DeepPartial } from 'typeorm/browser';
import { User } from '../entities/User';
import RepositoryBase from './RepositoryBase';

@EntityRepository(User)
export class UsersRepository extends RepositoryBase<User> {
  findByTwitterId(id: string): Promise<User | undefined> {
    return this.findOne({ twitterUserId: id });
  }

  async createFromAccessTokenResponse(accessTokenResponse: AccessTokenResponse): Promise<User> {
    const partial: DeepPartial<User> = {
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
