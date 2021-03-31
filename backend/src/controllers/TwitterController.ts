import { CurrentUser, Get, JsonController, QueryParams } from 'routing-controllers';
import Twit from 'twit';
import twitterService from '../services/TwitterService';
import { UserEntity } from '../entities/UserEntity';
import { TwitterUser } from '../TwitterEntities';
import RepositoryManager from '../services/RepositoryManager';

@JsonController('/api')
export default class TwitterController {
  @Get('/self')
  async self(
    @QueryParams() params: Twit.Params,
    @CurrentUser({ required: true }) user: UserEntity,
  ): Promise<TwitterUser> {
    const twitterUser = await twitterService.userGet<TwitterUser>(user, '/account/verify_credentials', params);
    await RepositoryManager.getTwitterUsers().saveRaw(twitterUser);
    return twitterUser;
  }

  @Get('/followers')
  followers(@QueryParams() params: Twit.Params, @CurrentUser({ required: true }) user: UserEntity): Promise<unknown> {
    return twitterService.userFollowers(user);
  }
}
