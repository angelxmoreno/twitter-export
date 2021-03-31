import { CurrentUser, Get, JsonController, QueryParams } from 'routing-controllers';
import Twit from 'twit';
import { UserEntity } from '../entities/UserEntity';
import { TwitterUser } from '../TwitterEntities';
import RepositoryManager from '../services/RepositoryManager';
import { PaginateOptions } from '../repositories/RepositoryBase';
import { PaginatorResponse } from '../helpers/paginatorDecorator';

@JsonController('/api')
export default class TwitterController {
  @Get('/self')
  async self(
    @QueryParams() params: Twit.Params,
    @CurrentUser({ required: true }) user: UserEntity,
  ): Promise<TwitterUser> {
    const twitterUser = await user.twitterClient.get<TwitterUser>('/account/verify_credentials', params);
    await RepositoryManager.getTwitterUsers().saveRaw(twitterUser);
    return twitterUser;
  }

  @Get('/followers')
  async followers(
    @QueryParams() params: { page: number },
    @CurrentUser({ required: true }) user: UserEntity,
  ): Promise<PaginatorResponse<TwitterUser>> {
    const paginationOptions: Partial<PaginateOptions> = {
      page: params.page,
    };
    await user.twitterClient.buildFollowerEntities();
    return RepositoryManager.getFollowers().paginate<TwitterUser>(
      {
        where: { twitterUserId: user.twitterUserId },
        relations: ['follower'],
      },
      paginationOptions,
      entity => entity.follower.data,
    );
  }
}
