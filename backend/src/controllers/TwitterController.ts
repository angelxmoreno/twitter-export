import { CurrentUser, Get, JsonController, QueryParams } from 'routing-controllers';
import Twit from 'twit';
import { FindManyOptions } from 'typeorm';
import { UserEntity } from '../entities/UserEntity';
import { TwitterUser } from '../TwitterEntities';
import RepositoryManager from '../services/RepositoryManager';
import { PaginateOptions } from '../repositories/RepositoryBase';
import { PaginatorResponse } from '../helpers/paginatorDecorator';
import { FollowerEntity } from '../entities/FollowerEntity';
import Cache, { buildCacheKey } from '../services/Cache';

@JsonController('/api')
export default class TwitterController {
  @Get('/self')
  async self(
    @QueryParams() params: Twit.Params,
    @CurrentUser({ required: true }) user: UserEntity,
  ): Promise<TwitterUser> {
    return Cache.wrap(buildCacheKey('twitterUser', user.twitterUserId), async () => {
      const twitterUser = await user.twitterClient.get<TwitterUser>('/account/verify_credentials', params);
      await RepositoryManager.getTwitterUsers().saveRaw(twitterUser);
      return twitterUser;
    });
  }

  @Get('/followers')
  async followers(
    @QueryParams() params: { page: number },
    @CurrentUser({ required: true }) user: UserEntity,
  ): Promise<PaginatorResponse<TwitterUser>> {
    const paginationOptions: Partial<PaginateOptions> = {
      page: params.page,
    };
    const findOptions: FindManyOptions<FollowerEntity> = {
      where: { twitterUserId: user.twitterUserId },
      relations: ['follower'],
    };
    await Cache.wrap(buildCacheKey('buildFollowers', user.twitterUserId), async () => {
      await user.twitterClient.buildFollowerEntities();
      return 'done';
    });

    return Cache.wrap(buildCacheKey('followers', user.twitterUserId, paginationOptions, findOptions), async () => {
      return RepositoryManager.getFollowers().paginate<TwitterUser>(
        findOptions,
        paginationOptions,
        entity => entity.follower.data,
      );
    });
  }
}
