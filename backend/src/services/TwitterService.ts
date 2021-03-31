/* eslint-disable camelcase */
import Twitter, { AccessTokenOptions, AccessTokenResponse } from 'twitter-lite';
import Twit from 'twit';
import { In } from 'typeorm';
import Env from '../helpers/Env';
import { UserEntity } from '../entities/UserEntity';
import RepositoryManager from './RepositoryManager';
import { TwitterUser } from '../TwitterEntities';
import chunk from '../helpers/chunk';

export interface RequestTokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_callback_confirmed: 'true';
}

export class TwitterService {
  protected consumer_key: string;

  protected consumer_secret: string;

  protected authClient: Twitter;

  constructor(consumer_key: string, consumer_secret: string) {
    this.consumer_key = consumer_key;
    this.consumer_secret = consumer_secret;
    this.authClient = new Twitter({ consumer_key, consumer_secret });
  }

  getAccessToken(options: AccessTokenOptions): Promise<AccessTokenResponse> {
    return this.authClient.getAccessToken(options);
  }

  getRequestToken(twitterCallbackUrl: string | 'oob'): Promise<RequestTokenResponse> {
    return (this.authClient.getRequestToken(twitterCallbackUrl) as unknown) as Promise<RequestTokenResponse>;
  }

  protected buildUserClient(user: UserEntity): Twit {
    return new Twit({
      consumer_key: this.consumer_key,
      consumer_secret: this.consumer_secret,
      access_token: user.oauthToken,
      access_token_secret: user.oauthTokenSecret,
    });
  }

  async userGet<T>(user: UserEntity, uri: string, params?: Twit.Params): Promise<T> {
    const client = this.buildUserClient(user);
    const { data } = await client.get(uri, params);
    return (data as unknown) as T;
  }

  async userFollowers(user: UserEntity, cursor?: string): Promise<unknown | void> {
    const followersRepo = RepositoryManager.getFollowers();
    const client = this.buildUserClient(user);
    const { data } = (await client.get('followers/ids', {
      count: 5000,
      stringify_ids: true,
      cursor,
    })) as { data: { ids: string[]; next_cursor_str: string } };
    const { ids, next_cursor_str } = data;
    await followersRepo.linkIds(user, ids);
    await this.userLookUp(user, ids);
    if (next_cursor_str !== '0' && next_cursor_str !== '-1') {
      return this.userFollowers(user, next_cursor_str);
    }
    return followersRepo.paginate({
      where: { twitterUserId: user.twitterUserId },
      relations: ['follower'],
    });
  }

  async userLookUp(user: UserEntity, ids: string[]): Promise<TwitterUser[]> {
    const twitterUsersRepo = RepositoryManager.getTwitterUsers();

    const client = this.buildUserClient(user);
    const chunked500 = chunk(ids, 500);

    const existingEntities = ((
      await Promise.all(
        chunked500.map(ids500 => {
          return twitterUsersRepo.findMany({
            where: { id: In(ids500) },
          });
        }),
      )
    )
      .flat()
      .filter(user500 => user500 !== undefined)
      .map(entity => entity && entity.data) as unknown) as TwitterUser[];
    const existingIds = existingEntities.map(twitterUser => twitterUser.id_str);
    const filteredIds = ids.filter(id => existingIds.indexOf(id) === -1);
    const chunked = chunk(filteredIds, 20);
    const promises = chunked.map(async user_ids => {
      const { data } = await client.get('users/lookup', {
        user_id: user_ids.join(','),
      });

      return data;
    });

    const users = await Promise.all(promises as Promise<TwitterUser[]>[]);
    await twitterUsersRepo.saveManyRaw(users.flat());
    return existingEntities.concat(users.flat());
  }
}

const twitterService = new TwitterService(Env.string('TWITTER_CONSUMER_KEY'), Env.string('TWITTER_CONSUMER_SECRET'));

export default twitterService;
