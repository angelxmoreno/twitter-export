/* eslint-disable camelcase */
import Twit from 'twit';
import { In } from 'typeorm';
import Env from '../helpers/Env';
import { UserEntity } from '../entities/UserEntity';
import RepositoryManager from './RepositoryManager';
import { TwitterUser } from '../TwitterEntities';
import chunk from '../helpers/chunk';
import { FollowersRepository } from '../repositories/FollowersRepository';
import { TwitterUsersRepository } from '../repositories/TwitterUsersRepository';
import { TwitterUserEntity } from '../entities/TwitterUserEntity';

export interface RequestTokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_callback_confirmed: 'true';
}

export class TwitterUserService {
  protected user: UserEntity;

  protected userClient: Twit;

  protected repos: {
    followers: FollowersRepository;
    twitterUsers: TwitterUsersRepository;
  };

  constructor(user: UserEntity, consumer_key: string, consumer_secret: string) {
    this.user = user;
    this.userClient = new Twit({
      consumer_key,
      consumer_secret,
      access_token: user.oauthToken,
      access_token_secret: user.oauthTokenSecret,
    });

    this.repos = {
      followers: RepositoryManager.getFollowers(),
      twitterUsers: RepositoryManager.getTwitterUsers(),
    };
  }

  async get<T>(uri: string, params?: Twit.Params): Promise<T> {
    const { data } = await this.userClient.get(uri, params);
    return (data as unknown) as T;
  }

  async buildFollowerEntities(cursor?: string): Promise<void> {
    const { data } = (await this.userClient.get('followers/ids', {
      count: 5000,
      stringify_ids: true,
      cursor,
    })) as { data: { ids: string[]; next_cursor_str: string } };
    const { ids, next_cursor_str } = data;
    await this.repos.followers.linkIds(this.user, ids);
    await this.userLookUp(ids);
    if (next_cursor_str !== '0' && next_cursor_str !== '-1') {
      await this.buildFollowerEntities(next_cursor_str);
    }
  }

  protected async getExistingTwitterUsersByIds(twitterUserIds: string[]): Promise<TwitterUser[]> {
    const batchSize = 500;
    const chunked = chunk(twitterUserIds, batchSize);

    const chunkedPromises = chunked.map(ids => {
      return this.repos.twitterUsers.findMany({
        where: { id: In(ids) },
      });
    });

    return (await Promise.all(chunkedPromises))
      .flat() // flatten (TwitterUserEntity[]|undefined)[] to (TwitterUserEntity|undefined)[]
      .filter((entity): entity is TwitterUserEntity => entity !== undefined) // filter (TwitterUserEntity|undefined)[] to TwitterUserEntity[]
      .map(entity => entity && entity.data); // map TwitterUserEntity[] to TwitterUser[]
  }

  async userLookUp(ids: string[]): Promise<TwitterUser[]> {
    const existingTwitterUsers = await this.getExistingTwitterUsersByIds(ids);
    const existingIds = existingTwitterUsers.map(twitterUser => twitterUser.id_str);
    const filteredIds = ids.filter(id => existingIds.indexOf(id) === -1);
    const chunked = chunk(filteredIds, 20); // twitter API does 20 lookups at a time
    const promises = chunked.map(async user_ids => {
      const { data } = await this.userClient.get('users/lookup', {
        user_id: user_ids.join(','),
      });

      return data as TwitterUser;
    });

    const newTwitterUsers = (await Promise.all(promises)).flat();
    await this.repos.twitterUsers.saveManyRaw(newTwitterUsers);
    return existingTwitterUsers.concat(newTwitterUsers);
  }
}

const twitterUserServiceFactory = (user: UserEntity): TwitterUserService =>
  new TwitterUserService(user, Env.string('TWITTER_CONSUMER_KEY'), Env.string('TWITTER_CONSUMER_SECRET'));

export default twitterUserServiceFactory;
